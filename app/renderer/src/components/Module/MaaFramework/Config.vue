<script setup lang="ts">
import { version } from '@maa/loader'
import { NInput, NInputNumber, NSwitch } from 'naive-ui'
import { computed, ref, watch } from 'vue'

import { useTr } from '@/i18n'
import GridFormLayout from '@/layouts/GridFormLayout.vue'
import { useModule } from '@/stores/module'

defineProps<{
  disabled: boolean
}>()

const { t } = useTr()

const emits = defineEmits<{
  'update:config': [unknown]
}>()

const info = computed(() => {
  return useModule.info.value.MaaFramework
})

const cc = computed(() => {
  const cc = info.value?.config as
    | {
        host?: string
        port?: number
        path?: string
        debug?: boolean
      }
    | undefined
  return {
    host: 'localhost',
    port: 8080,
    path: 'MaaRpcCli',
    debug: false,
    ...(cc ?? {})
  }
})

const maaver = ref<string | null>(null)

watch(
  () => info.value?.loaded,
  v => {
    if (v) {
      version().then(ver => {
        maaver.value = ver
      })
    } else {
      maaver.value = null
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <GridFormLayout>
    <template v-if="info?.channel === 'external'">
      <span class="whitespace-nowrap"> {{ t('setting.maaframework.cli_path') }} </span>
      <NInput
        :value="cc.path"
        @update:value="
          p =>
            emits('update:config', {
              ...cc,
              path: p
            })
        "
        :disabled="disabled"
      ></NInput>
    </template>
    <span> {{ t('setting.maaframework.service_address') }} </span>
    <NInputNumber
      :min="1"
      :max="65535"
      :value="cc.port"
      @update:value="
        v =>
          emits('update:config', {
            ...cc,
            port: v
          })
      "
      :disabled="disabled"
    >
      <template #prefix> {{ cc.host }}: </template>
    </NInputNumber>
    <span> {{ t('setting.maaframework.debug') }} </span>
    <div>
      <NSwitch
        :value="cc.debug"
        @update:value="
          v =>
            emits('update:config', {
              ...cc,
              debug: v
            })
        "
        :disabled="disabled"
      ></NSwitch>
    </div>
    <span> {{ t('setting.maaframework.version') }} </span>
    <span v-if="info?.loaded"> {{ maaver }} </span>
  </GridFormLayout>
</template>
