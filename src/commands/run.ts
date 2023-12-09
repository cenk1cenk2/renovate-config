import { PRESETS, Preset } from '@presets'
import { join } from 'path'

import { Command, ConfigService, JsonParser, ParserService, ShouldRunBeforeHook } from '@cenk1cenk2/oclif-common'
import { File } from '@constants'

export default class Run extends Command<typeof Run, any> implements ShouldRunBeforeHook {
  static aliases = [ '' ]

  private cs: ConfigService
  private parser: ParserService

  public async shouldRunBefore (): Promise<void> {
    this.cs = this.app.get(ConfigService)
    this.parser = this.app.get(ParserService)

    await this.parser.register(JsonParser)
    this.tasks.options = {
      silentRendererCondition: true
    }
  }

  public async run (): Promise<any> {
    this.tasks.add([
      {
        task: async (): Promise<void> => {
          this.logger.info('Processing presets...')

          const presets = Object.fromEntries(
            await Promise.all(
              Object.values(Preset).map(async (name) => {
                const preset = await PRESETS[name]

                this.logger.info('Processing preset: %s', name)

                return [ name, preset ]
              })
            )
          )

          if (this.cs.isDebug) {
            this.logger.warn('In development mode was supposed to write: %o', presets)

            return
          }

          this.logger.info('Writing preset: %s', File.OUTPUT)

          await this.parser.write(join(this.cs.root, File.OUTPUT), presets)
        }
      }
    ])
  }
}
