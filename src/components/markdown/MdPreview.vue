<template>
  <MdPreview
    noIconfont
    noPrettier
    htmlPreview
    :codeFoldable="false"
    previewTheme="cyanosis"
    codeTheme="cyanosis"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { MdPreview } from 'md-editor-v3';
  defineOptions({ name: 'MdPreview' });
</script>
