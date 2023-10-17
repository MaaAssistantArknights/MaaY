import { registerRecv } from '@/sync'

export const module_info = registerRecv('module_info', {} as any)

export const useModule = {
  info: module_info
}
