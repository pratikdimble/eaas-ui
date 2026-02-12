<template>
  <ModelList api-url="/evaluate?isBatch=false" title="Online Models" :page-size="5" />
</template>

<script setup>
import ModelList from '@/components/ModelList.vue'
</script>
