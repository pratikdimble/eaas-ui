<template>
  <ModelList api-url="/evaluate?isBatch=true" title="Batch Models" :page-size="5" />
</template>

<script setup>
import ModelList from '@/components/ModelList.vue'
</script>
