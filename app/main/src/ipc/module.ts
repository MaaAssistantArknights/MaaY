import { ModuleInfo } from '@maa/ipc'
import { computed } from '@vue/reactivity'

import { ipcMainHandle } from '.'
import { moduleIndexs, modules } from '../components'
import { registerSendFor } from '../sync'

export function setupModules() {
  const status = computed(() => {
    const info: Record<string, ModuleInfo> = {}
    for (const m of modules) {
      info[m.name] = {
        name: m.name,
        channels: m.channels,
        loaded: m.loaded,
        channel: m.channel,
        channel_config: m.channel_config,
        version: m.version,
        update_version: m.update_version
      }
    }
    return info
  })
  registerSendFor('module_info', status)

  ipcMainHandle('main.module.load', async (_, name) => {
    if (name in moduleIndexs) {
      return await moduleIndexs[name as keyof typeof moduleIndexs].load()
    } else {
      return false
    }
  })
  ipcMainHandle('main.module.unload', async (_, name) => {
    await moduleIndexs[name as keyof typeof moduleIndexs]?.unload()
  })
}
