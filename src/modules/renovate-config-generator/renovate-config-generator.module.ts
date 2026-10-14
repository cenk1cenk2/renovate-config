import { Module } from '@nestjs/common'

import { RenovateConfigGeneratorHandler } from './renovate-config-generator.handler.js'
import { JsonParser, ParserModule, TaskModule } from '@cenk1cenk2/oclif-common'

@Module({
  imports: [TaskModule.forRoot({ silentRendererCondition: true }), ParserModule.forRoot({ parsers: [JsonParser] })],
  providers: [RenovateConfigGeneratorHandler]
})
export class RenovateConfigGeneratorModule {}
