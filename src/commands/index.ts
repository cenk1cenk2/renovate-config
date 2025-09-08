import { diff } from 'jsondiffpatch'
import Formatter from 'jsondiffpatch/formatters/console'
import type { Listr } from 'listr2'
import { join } from 'path'

import type { CliModuleOptions, DynamicModule, RegisterHook, ShouldRunBeforeHook } from '@cenk1cenk2/oclif-common'
import { Command, ConfigService, JsonParser, LockerModule, LockerService, MergeStrategy, ParserService } from '@cenk1cenk2/oclif-common'
import { File } from '@constants'
import { PRESETS, Preset } from '@presets'
import type { Presets } from '@presets'

export default class Run extends Command<typeof Run, any> implements ShouldRunBeforeHook, RegisterHook {
  private cs: ConfigService
  private parser: ParserService
  private locker: LockerService<Presets>

  public register(cli: DynamicModule, options: CliModuleOptions): DynamicModule {
    cli.imports.push(
      LockerModule.forFeature({
        file: join(options.config.oclif.root, File.OUTPUT),
        parser: JsonParser
      })
    )

    return cli
  }

  public async shouldRunBefore(): Promise<void> {
    this.cs = this.app.get(ConfigService)
    this.parser = this.app.get(ParserService)
    this.locker = this.app.get(LockerService)

    await this.parser.register(JsonParser)
    this.tasks.options = {
      silentRendererCondition: true
    }
  }

  public async run(): Promise<void> {
    this.tasks.add([
      {
        task: (_, task): Listr =>
          task.newListr(
            Object.values(Preset).map((name) => {
              return {
                task: async(): Promise<void> => {
                  this.logger.info('Processing preset: %s', name)
                  this.locker.addLock<Partial<Presets>>({ data: { [name]: await PRESETS[name] }, merge: MergeStrategy.EXTEND })
                }
              }
            }),
            {
              // i do want to make these in order
              concurrent: false
            }
          )
      },
      {
        task: async(): Promise<void> => {
          const difference = new Formatter().format(diff(await this.locker.applyLockAll({} as Presets), await this.locker.read()))

          if (!difference) {
            this.logger.warn('No difference!')
          }

          // eslint-disable-next-line no-console
          console.log(difference)
        }
      },
      {
        skip: (): boolean => {
          const skip = this.cs.isDebug

          if (skip) {
            this.logger.warn('Debug mode is enabled, skipping outputting to a file: %s', File.OUTPUT)
          }

          return skip
        },
        task: async(): Promise<void> => {
          this.logger.info('Writing preset: %s', File.OUTPUT)
          await this.locker.tryRemove()
          await this.locker.all()
        }
      }
    ])
  }
}
