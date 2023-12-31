<script setup lang="ts">
import { NButton, NCard, NInput, NModal, NRadio, NRadioGroup } from 'naive-ui'
import { computed, ref } from 'vue'

import { useTr } from '@/i18n'

const { t } = useTr()

const showImport = ref(false)
const importLoading = ref(false)
const importType = ref<'repo' | 'dir'>('repo')

const importName = ref<string | null>(null)

const importRepoUrl = ref('')
const importDir = ref('')

const inferName = computed(() => {
  let fromName: string
  switch (importType.value) {
    case 'repo':
      fromName = importRepoUrl.value
      break
    case 'dir':
      fromName = importDir.value
      break
  }
  const m = /\/([^/]+)$/.exec(fromName)
  if (m) {
    return m[1]!
  } else {
    return t('resource.import.placeholder.name')
  }
})

async function doImport() {
  importLoading.value = true
  let loaded: boolean
  switch (importType.value) {
    case 'repo':
      loaded = await window.ipcRenderer.invoke(
        'main.resource.import_repo',
        importName.value ?? inferName.value,
        importRepoUrl.value
      )
      break
    case 'dir':
      loaded = await window.ipcRenderer.invoke(
        'main.resource.import_dir',
        importName.value ?? inferName.value,
        importDir.value
      )
      break
  }
  importLoading.value = false
  if (loaded) {
    showImport.value = false
    window.ipcRenderer.invoke('main.resource.refresh')
  }
}

function open() {
  showImport.value = true
}

defineExpose({
  open
})
</script>

<template>
  <NModal v-model:show="showImport">
    <NCard style="width: 80vw" :title="t('resource.import.title')">
      <div class="flex flex-col gap-2">
        <NRadioGroup v-model:value="importType">
          <div class="flex gap-2">
            <NRadio value="repo"> {{ t('resource.import.remote_repo') }} </NRadio>
            <NRadio value="dir"> {{ t('resource.import.local_dir') }} </NRadio>
          </div>
        </NRadioGroup>
        <NInput v-model:value="importName" :placeholder="inferName"></NInput>
        <template v-if="importType === 'repo'">
          <NInput
            v-model:value="importRepoUrl"
            placeholder="https://github.com/author/repo"
          ></NInput>
          <div class="flex gap-2">
            <NButton :disabled="!importRepoUrl" @click="doImport" :loading="importLoading">
              {{ t('global.add') }}
            </NButton>
          </div>
        </template>
        <template v-else-if="importType === 'dir'">
          <NInput v-model:value="importDir" placeholder="/path/to/repo"></NInput>
          <div class="flex gap-2">
            <NButton :disabled="!importDir" @click="doImport" :loading="importLoading">
              {{ t('global.add') }}
            </NButton>
          </div>
        </template>
      </div>
    </NCard>
  </NModal>
</template>
