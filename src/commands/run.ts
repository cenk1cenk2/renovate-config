import { PRESETS, Preset, Presets } from '@presets'
import { join } from 'path'

import {
  CliModuleOptions,
  Command,
  ConfigService,
  DynamicModule,
  JsonParser,
  LockerModule,
  LockerService,
  MergeStrategy,
  ParserService,
  RegisterHook,
  ShouldRunBeforeHook
} from '@cenk1cenk2/oclif-common'
import { File } from '@constants'

export default class Run extends Command<typeof Run, any> implements ShouldRunBeforeHook, RegisterHook {
  private cs: ConfigService
  private parser: ParserService
  private locker: LockerService<Presets>

  public register (cli: DynamicModule, options: CliModuleOptions): DynamicModule {
    cli.imports.push(
      LockerModule.forFeature({
        file: join(options.config.oclif.root, File.OUTPUT),
        parser: JsonParser
      })
    )

    return cli
  }

  public async shouldRunBefore (): Promise<void> {
    this.cs = this.app.get(ConfigService)
    this.parser = this.app.get(ParserService)
    this.locker = this.app.get(LockerService)

    await this.parser.register(JsonParser)
    this.tasks.options = {
      silentRendererCondition: true
    }
  }

  public async run (): Promise<void> {
    this.tasks.add([
      {
        task: (_, task) =>
          task.newListr(
            Object.values(Preset).map((name) => {
              return {
                task: async (): Promise<void> => {
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
        enabled: (): boolean => this.cs.isDebug,
        task: async (): Promise<void> => {
          this.logger.warn('Debug mode does not output to file: %s -> %o', File.OUTPUT, await this.locker.applyAll({} as Presets))
        }
      },
      {
        skip: (): boolean => this.cs.isDebug,
        task: async (): Promise<void> => {
          this.logger.info('Writing preset: %s', File.OUTPUT)
          await this.locker.tryRemove()
          await this.locker.all()
        }
      }
    ])
  }
}
