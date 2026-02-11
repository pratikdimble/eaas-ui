<template>
  <ModelList
    api-url="http://localhost:8080/api/evaluate?isBatch=true"
    title="Batch Models"
    :page-size="5"
  />
</template>

<script setup>
import ModelList from '@/components/ModelList.vue'
</script>
