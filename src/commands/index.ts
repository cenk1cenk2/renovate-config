import { diff } from 'jsondiffpatch'
import Formatter from 'jsondiffpatch/formatters/console'
import type { Listr } from 'listr2'
import { join } from 'path'
import { migrateConfig } from 'renovate/dist/config/migration.js'
import { validateConfig } from 'renovate/dist/config/validation.js'

import type { CliModuleOptions, DynamicModule, RegisterHook, ShouldRunBeforeHook, LockerService } from '@cenk1cenk2/oclif-common'
import { Command, ConfigService, JsonParser, LockerModule, MergeStrategy, ParserService } from '@cenk1cenk2/oclif-common'
import { FILES, PRESETS } from '@presets'
import type { Presets } from '@presets'

export default class Run extends Command<typeof Run, any> implements ShouldRunBeforeHook, RegisterHook {
  private cs: ConfigService
  private parser: ParserService
  private lockers: Map<string, LockerService<Presets>>

  public register(cli: DynamicModule, options: CliModuleOptions): DynamicModule {
    for (const file of Object.keys(FILES)) {
      cli.imports.push(
        LockerModule.forFeature({
          file: join(options.config.oclif.root, file),
          parser: JsonParser,
          token: this.token(file)
        })
      )
    }

    return cli
  }

  public async shouldRunBefore(): Promise<void> {
    this.cs = this.app.get(ConfigService)
    this.parser = this.app.get(ParserService)

    this.lockers = new Map()

    for (const file of Object.keys(FILES)) {
      this.lockers.set(file, this.app.get(this.token(file)))
    }

    await this.parser.register(JsonParser)
    this.tasks.options = {
      silentRendererCondition: true
    }
  }

  public async run(): Promise<void> {
    this.tasks.add(
      (Object.entries(FILES) as [string, (keyof Presets)[]][]).map(([file, presets]) => ({
        title: `Processing file: ${file}`,
        task: (_, task): Listr =>
          task.newListr(
            [
              {
                task: (_, subtask): Listr => {
                  const locker = this.lockers.get(file)

                  return subtask.newListr(
                    presets.map((name) => ({
                      task: async(): Promise<void> => {
                        this.logger.info('Processing preset: %s → %s', name, file)
                        locker.addLock<Partial<Presets>>({ data: { [name]: await PRESETS[name] }, merge: MergeStrategy.EXTEND })
                      }
                    })),
                    { concurrent: false }
                  )
                }
              },
              {
                task: async(): Promise<void> => {
                  const locker = this.lockers.get(file)
                  const current = await locker.applyLockAll({} as Presets)

                  this.logger.info('Validating config for file: %s', file)
                  await Promise.all(
                    Object.entries(current).map(async([preset, value]) => {
                      const migration = migrateConfig(await value)

                      if (migration.isMigrated) {
                        this.logger.warn('Preset %s needs migration, showing difference between current and migrated config:', preset)
                        const difference = new Formatter().format(diff(value, migration.migratedConfig))

                        // eslint-disable-next-line no-console
                        console.log(difference)
                      }

                      const result = await validateConfig('global', await value, true)

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
                    })
                  )

                  const difference = new Formatter().format(diff(await locker.read(), current))

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
                  const skip = this.cs.isDebug

                  if (skip) {
                    this.logger.warn('Debug mode is enabled, skipping outputting to a file: %s', file)
                  }

                  return skip
                },
                task: async(): Promise<void> => {
                  const locker = this.lockers.get(file)

                  this.logger.info('Writing preset: %s', file)
                  await locker.tryRemove()
                  await locker.all()
                }
              }
            ],
            { concurrent: false }
          )
      }))
    )
  }

  private token(file: string): symbol {
    return Symbol.for(file.toString())
  }
}
