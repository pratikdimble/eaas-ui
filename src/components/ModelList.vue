<template>
  <div class="vh-100 p-4 dashboard-bg">
    <!-- Header -->
    <h2 class="mb-3 text-primary">{{ title }}</h2>

    <!-- Stats Cards -->
    <!-- Legend next to stats -->
    <div class="d-flex gap-3 mb-4 flex-wrap align-items-center">
      <div class="stat-card"><strong>Total Models:</strong> {{ totalModels }}</div>
      <div class="stat-card"><strong>Models With Differences:</strong> {{ diffModels }}</div>
      <div v-if="responseTime !== null" class="stat-card">
        <strong>Evaluation Time:</strong> {{ responseTime }} ms
      </div>

      <!-- Legend -->
      <div class="legend d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-1">
          <span class="legend-badge bg-success" title="Records match"></span>
          <small>Match</small>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="legend-badge bg-danger" title="Records mismatch"></span>
          <small>Mismatch</small>
        </div>
      </div>
    </div>

    <!-- Search bar -->
    <div class="mb-3 search-wrapper">
      <input
        type="search"
        v-model="searchTermLocal"
        class="form-control search-input"
        placeholder="Search models..."
        autocomplete="off"
      />
      <i class="bi bi-search search-icon"></i>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-grow-1 d-flex justify-content-center align-items-center">
      <div class="spinner-border text-primary" role="status"></div>
      <span class="ms-2 text-muted">Loading...</span>
    </div>

    <!-- Models List -->
    <transition-group name="fade-slide" tag="div" class="models-list">
      <div v-for="model in paginatedModels" :key="model.model" class="model-card mb-3 shadow-sm">
        <!-- Model Header -->
        <button
          class="btn btn-model-header w-100 d-flex justify-content-between align-items-center"
          @click="toggle(model.model)"
        >
          <span>
            {{ model.model }}
            <small class="text-muted ms-2">
              (Modified: {{ formatDate(model.modifiedDate) }})
            </small>
          </span>
          <small class="text-muted">
            {{ filteredOutputs(model).length }} Differences
            <span v-if="expanded === model.model">▲</span>
            <span v-else>▼</span>
          </small>
        </button>

        <!-- Expanded Section -->
        <transition name="fade-slide-inner">
          <div v-if="expanded === model.model && filteredOutputs(model).length" class="px-3 pb-3">
            <table class="table table-striped table-hover table-sm modern-table">
              <thead>
                <tr>
                  <th class="header-a">Input A</th>
                  <th class="header-a">Input A Records</th>
                  <th class="header-b">Input B</th>
                  <th class="header-b">Input B Records</th>
                  <th class="header-diff">Attributes with Differences</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(output, idx) in filteredOutputs(model)"
                  :key="idx"
                  :class="{
                    'row-highlight':
                      Number(output.attributesWithDifferences) > 0 ||
                      Number(output.inputARecords) !== Number(output.inputBRecords),
                  }"
                >
                  <td>{{ output.inputA }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="
                        Number(output.inputARecords) === Number(output.inputBRecords)
                          ? 'bg-success text-light'
                          : 'bg-danger text-light'
                      "
                      :title="`Input A Records: ${output.inputARecords}`"
                    >
                      {{ output.inputARecords }}
                    </span>
                  </td>
                  <td>{{ output.inputB }}</td>
                  <td>
                    <span
                      class="badge"
                      :class="
                        Number(output.inputARecords) === Number(output.inputBRecords)
                          ? 'bg-success text-light'
                          : 'bg-danger text-light'
                      "
                      :title="`Input B Records: ${output.inputBRecords}`"
                    >
                      {{ output.inputBRecords }}
                    </span>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="
                        Number(output.attributesWithDifferences) > 0
                          ? 'bg-danger text-light'
                          : 'bg-success text-light'
                      "
                      :title="`Attributes with Differences: ${output.attributesWithDifferences}`"
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
    </transition-group>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center pagination-modern">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link rounded-pill" @click="prevPage">Previous</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <button class="page-link rounded-pill" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link rounded-pill" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  apiUrl: { type: String, required: true },
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
const responseTime = ref(null)

const fetchModels = async () => {
  loading.value = true
  const startTime = performance.now()
  try {
    const response = await axios.get(props.apiUrl)
    const endTime = performance.now()
    responseTime.value = Math.round(endTime - startTime)

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
  expanded.value = expanded.value === modelId ? null : modelId
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

const formatDate = (isoString) => {
  if (!isoString) return '-'
  const d = new Date(isoString)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}
</script>

<style scoped>
/* Background gradient */
.dashboard-bg {
  background: linear-gradient(to bottom right, #f0f4ff, #e6f2ff);
  min-height: 100vh;
}

/* Stats cards */
.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
}

/* Search bar */
.search-wrapper {
  position: relative;
  max-width: 400px;
}
.search-input {
  padding-left: 2.5rem;
  border-radius: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 1.1rem;
}

/* Model cards */
.model-card {
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.model-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Model header button */
.btn-model-header {
  background-color: #e3f2fd;
  padding: 12px 16px;
  font-weight: 500;
  text-align: left;
  border: none;
  transition: background 0.2s ease;
}
.btn-model-header:hover {
  background-color: #d0e7fd;
}

/* Table */
.modern-table th,
.modern-table td {
  vertical-align: middle;
}
.header-a {
  background-color: #cce5ff;
}
.header-b {
  background-color: #d4edda;
}
.header-diff {
  background-color: #f8d7da;
}

.row-highlight {
  background-color: #fff0f0 !important;
}

/* Badges */
.badge {
  font-size: 0.85em;
  padding: 0.35em 0.6em;
}

/* Pagination */
.pagination-modern .page-link {
  min-width: 40px;
  text-align: center;
  margin: 0 3px;
}
.pagination-modern .page-item.active .page-link {
  background-color: #1976d2;
  color: #fff;
  border: none;
}
.pagination-modern .page-link.rounded-pill {
  border-radius: 50px;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-inner-enter-active,
.fade-slide-inner-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-inner-enter-from,
.fade-slide-inner-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.fade-slide-inner-enter-to,
.fade-slide-inner-leave-from {
  opacity: 1;
  max-height: 500px;
}
.legend {
  font-size: 0.85rem;
  color: #555;
}

.legend-badge {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: help; /* indicates tooltip available */
}
</style>
