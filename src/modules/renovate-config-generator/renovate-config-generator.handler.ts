import { Inject, Injectable } from '@nestjs/common'
import { mergeWith, uniq } from 'es-toolkit'
import { existsSync } from 'fs'
import { diff } from 'jsondiffpatch'
import Formatter from 'jsondiffpatch/formatters/console'
import type { Listr } from 'listr2'
import { join } from 'path'
import { migrateConfig } from 'renovate/dist/config/migration.js'
import type { RenovateConfig } from 'renovate/dist/config/types.js'
import { validateConfig } from 'renovate/dist/config/validation.js'

import type Run from '../../commands/index.js'
import { ConfigService, LoggerService, ParserService, TaskManager } from '@cenk1cenk2/oclif-common'
import type { CommandContext, CommandHandler } from '@cenk1cenk2/oclif-common'
import { FILES, PRESETS } from '@presets'
import type { Presets } from '@presets'

@Injectable()
export class RenovateConfigGeneratorHandler implements CommandHandler<typeof Run> {
  // `pnpm dev` runs the source through tsx, whose esbuild transform emits no `design:paramtypes`, so the
  // tokens are named explicitly rather than inferred from the parameter types.
  constructor(
    @Inject(LoggerService) private readonly logger: LoggerService,
    @Inject(TaskManager) private readonly tasks: TaskManager,
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(ParserService) private readonly parser: ParserService
  ) {}

  public async run({ oclif }: CommandContext<typeof Run>): Promise<void> {
    this.tasks.add(
      (Object.entries(FILES) as [string, (keyof Presets)[]][]).map(([file, presets]) => {
        const path = join(oclif.root, file)
        let current: Record<string, RenovateConfig> = {}

        return {
          title: `Processing file: ${file}`,
          task: (_, task): Listr =>
            task.newListr(
              [
                {
                  task: (_, subtask): Listr =>
                    subtask.newListr(
                      presets.map((name) => ({
                        task: async(): Promise<void> => {
                          this.logger.info('Processing preset: %s → %s', name, file)
                          current = mergeWith(current, { [name]: await PRESETS[name] }, (target, value) =>
                            Array.isArray(target) && Array.isArray(value) ? uniq([...target, ...value]) : undefined
                          )
                        }
                      })),
                      { concurrent: false }
                    )
                },
                {
                  task: async(): Promise<void> => {
                    this.logger.info('Validating config for file: %s', file)
                    const errorCounts = await Promise.all(
                      Object.entries(current).map(async([preset, value]) => {
                        const migration = migrateConfig(value)

                        if (migration.isMigrated) {
                          this.logger.warn('Preset %s needs migration, showing difference between current and migrated config:', preset)
                          const difference = new Formatter().format(diff(value, migration.migratedConfig))

                          // eslint-disable-next-line no-console
                          console.log(difference)
                        }

                        const result = await validateConfig('global', value, true)

                        if (result.warnings.length > 0) {
                          for (const warning of result.warnings) {
                            this.logger.warn('[%s] [%s] [%s] %s', file, preset, warning.topic, warning.message)
                          }
                        }

                        if (result.errors.length > 0) {
                          for (const error of result.errors) {
                            this.logger.error('[%s] [%s] [%s] %s', file, preset, error.topic, error.message)
                          }
                        }

                        return result.errors.length
                      })
                    )

                    const errorCount = errorCounts.reduce((total, count) => total + count, 0)

                    if (errorCount > 0) {
                      throw new Error(`Validation failed for file: ${file} with ${errorCount} error(s)`)
                    }

                    const difference = new Formatter().format(diff(existsSync(path) ? await this.parser.read(path) : undefined, current))

                    if (!difference) {
                      this.logger.warn('No difference in %s!', file)
                    } else {
                      this.logger.info('Difference found in %s!', file)
                    }

                    // eslint-disable-next-line no-console
                    console.log(difference)
                  }
                },
                {
                  skip: (): boolean => {
                    const skip = this.config.isDebug

                    if (skip) {
                      this.logger.warn('Debug mode is enabled, skipping outputting to a file: %s', file)
                    }

                    return skip
                  },
                  task: async(): Promise<void> => {
                    this.logger.info('Writing preset: %s', file)
                    await this.parser.write(path, current)
                  }
                }
              ],
              { concurrent: false }
            )
        }
      })
    )

    await this.tasks.runAll()
  }
}
