import { ModuleInfo, ModuleUpgradeChannel } from '@maa/type'

export abstract class Module implements ModuleInfo {
  abstract readonly name: string
  abstract readonly channels: ModuleUpgradeChannel[]

  loaded = false
  channel?: string
  config?: unknown
  version?: string
  update_version?: string

  abstract load(): Promise<boolean>
  abstract unload(): Promise<boolean>
  abstract update(channel: string): Promise<boolean>
  abstract upgrade(): Promise<boolean>
}
