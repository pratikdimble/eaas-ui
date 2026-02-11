<template>
  <div class="vh-100 d-flex flex-column p-4 bg-light">
    <h2 class="mb-3">{{ title }}</h2>
    <p>
      <strong>Total Models:</strong> {{ totalModels }}
      &nbsp;&nbsp;&nbsp;
      <strong>Models With Differences:</strong> {{ diffModels }}
    </p>

    <input
      type="search"
      v-model="searchTermLocal"
      class="form-control mb-3"
      placeholder="Search model..."
      autocomplete="off"
    />

    <div v-if="loading" class="flex-grow-1 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
      <span class="ms-2">Loading...</span>
    </div>

    <div v-else class="flex-grow-1 d-flex flex-column">
      <div v-for="model in paginatedModels" :key="model.model" class="border-bottom">
        <!-- Model Header -->
        <button
          class="btn btn-link d-flex justify-content-between w-100 px-3 py-2 fw-bold"
          @click="model.outputDTOList.length ? toggle(model.model) : null"
          :aria-expanded="expanded.value === model.model"
          :class="{
            'text-muted': model.outputDTOList.length === 0,
            'cursor-not-allowed': model.outputDTOList.length === 0,
          }"
          :title="
            model.outputDTOList.length === 0 ? 'No outputs available' : 'Click to expand details'
          "
        >
          {{ model.model }}
          <small class="text-muted">
            {{ filteredOutputs(model).length }} filtered output(s)
            <span v-if="expanded.value === model.model">▲</span>
            <span v-else>▼</span>
          </small>
        </button>

        <transition name="fade">
          <div
            v-if="expanded.value === model.model && filteredOutputs(model).length"
            class="px-3 pb-3"
          >
            <table class="table table-sm table-bordered table-hover mb-2">
              <thead class="table-light">
                <tr>
                  <th>Input A</th>
                  <th>Input A Records</th>
                  <th>Input B</th>
                  <th>Input B Records</th>
                  <th>Attributes with Differences</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(output, idx) in filteredOutputs(model)" :key="idx">
                  <td>{{ output.inputA }}</td>
                  <td>
                    <span
                      :class="{
                        'text-danger':
                          Number(output.inputARecords) !== Number(output.inputBRecords),
                      }"
                    >
                      {{ output.inputARecords }}
                    </span>
                  </td>
                  <td>{{ output.inputB }}</td>
                  <td>
                    <span
                      :class="{
                        'text-danger':
                          Number(output.inputARecords) !== Number(output.inputBRecords),
                      }"
                    >
                      {{ output.inputBRecords }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="{
                        'text-danger': Number(output.attributesWithDifferences) > 0,
                      }"
                    >
                      {{ output.attributesWithDifferences }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>

      <nav v-if="totalPages > 1" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">Previous</button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="currentPage = page">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="nextPage">Next</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue' // ✅ Make sure onMounted is imported
import axios from 'axios'

const props = defineProps({
  apiUrl: { type: String, required: true }, // required prop
  title: { type: String, default: 'Models' },
  pageSize: { type: Number, default: 5 },
})

const expanded = ref(null)
const models = ref([])
const loading = ref(false)
const searchTermLocal = ref('')
const totalModels = ref(0)
const diffModels = ref(0)
const currentPage = ref(1)

const fetchModels = async () => {
  loading.value = true
  try {
    const response = await axios.get(props.apiUrl)
    models.value = response.data.modelDTOs || []
    totalModels.value = response.data.totalModels || models.value.length
    diffModels.value = response.data.diffModels || 0
  } catch (e) {
    console.error('API fetch error:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchModels)

const toggle = (modelId) => {
  if (expanded.value === modelId) {
    expanded.value = null // collapse if same model clicked
  } else {
    expanded.value = modelId // expand the clicked model
  }
}

const filteredModels = computed(() => {
  const term = searchTermLocal.value.trim().toLowerCase()
  return models.value.filter((model) => {
    const hasDiff = model.outputDTOList.some(
      (o) =>
        Number(o.attributesWithDifferences) > 0 ||
        Number(o.inputARecords) !== Number(o.inputBRecords),
    )
    if (!hasDiff) return false
    return !term || model.model.toLowerCase().includes(term)
  })
})

const filteredOutputs = (model) => {
  return model.outputDTOList.filter(
    (o) =>
      Number(o.attributesWithDifferences) > 0 ||
      Number(o.inputARecords) !== Number(o.inputBRecords),
  )
}

const paginatedModels = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filteredModels.value.slice(start, start + props.pageSize)
})

const totalPages = computed(() => Math.ceil(filteredModels.value.length / props.pageSize) || 1)

const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++

watch(searchTermLocal, () => (currentPage.value = 1))
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.6;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
