import { RenovateConfigGeneratorHandler } from '../modules/renovate-config-generator/renovate-config-generator.handler.js'
import { RenovateConfigGeneratorModule } from '../modules/renovate-config-generator/renovate-config-generator.module.js'
import { Command, UseHandler } from '@cenk1cenk2/oclif-common'

@UseHandler({ module: RenovateConfigGeneratorModule, handler: RenovateConfigGeneratorHandler })
export default class Run extends Command {}
