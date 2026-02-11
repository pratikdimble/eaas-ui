<template>
  <div class="dashboard-bg d-flex flex-column p-4">
    <!-- Header -->
    <div class="header-wrapper mb-4">
      <h2 class="text-primary mb-3">{{ title }}</h2>
      <div class="stats-row d-flex gap-3 flex-wrap align-items-center">
        <div class="stat-card"><strong>Total Models:</strong> {{ totalModels }}</div>
        <div class="stat-card"><strong>Models With Differences:</strong> {{ diffModels }}</div>
        <div v-if="responseTime !== null" class="stat-card">
          <strong>Evaluation Time:</strong> {{ responseTime }} ms
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-3 search-wrapper position-relative">
      <input
        type="search"
        v-model="searchTermLocal"
        class="form-control search-input"
        placeholder="Search models and press Enter..."
        @keypress="handleSearch"
      />
      <i class="bi bi-search search-icon"></i>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-grow-1 d-flex justify-content-center align-items-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
      <span class="ms-2 text-muted">Fetching models...</span>
    </div>

    <!-- Main Models List -->
    <div class="models-list-wrapper flex-grow-1 overflow-auto">
      <transition-group name="fade-slide" tag="div" class="models-list">
        <div v-for="model in paginatedModels" :key="model.model" class="model-card mb-3 shadow-sm">
          <!-- Expandable Header -->
          <button
            class="btn btn-model-header w-100 d-flex justify-content-between align-items-center"
            @click="toggle(model.model)"
          >
            <div>
              <strong>{{ model.model }}</strong>
              <small class="text-muted ms-2">({{ formatDate(model.modifiedDate) }})</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-danger">{{ countDiffs(model) }} Differences</span>
              <span v-if="expanded === model.model">▲</span>
              <span v-else>▼</span>
            </div>
          </button>

          <!-- Expanded Content Always Visible -->
          <transition name="fade-slide-inner">
            <div v-if="expanded === model.model" class="px-3 pb-3">
              <!-- If differences exist show table -->
              <table
                v-if="filteredOutputs(model).length"
                class="table table-striped table-hover table-sm modern-table"
              >
                <thead class="table-light">
                  <tr>
                    <th>Input A</th>
                    <th>Records A</th>
                    <th>Input B</th>
                    <th>Records B</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(output, idx) in filteredOutputs(model)" :key="idx">
                    <td>{{ output.inputA }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          Number(output.inputARecords) === Number(output.inputBRecords)
                            ? 'bg-success'
                            : 'bg-danger'
                        "
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
                            ? 'bg-success'
                            : 'bg-danger'
                        "
                      >
                        {{ output.inputBRecords }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          Number(output.attributesWithDifferences) > 0 ? 'bg-danger' : 'bg-success'
                        "
                      >
                        {{ output.attributesWithDifferences }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Friendly message if no diffs -->
              <div v-else class="text-center text-secondary py-3">
                No differences found for this model.
              </div>
            </div>
          </transition>
        </div>
      </transition-group>
    </div>

    <!-- Main Pagination -->
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

    <!-- Modal Popup -->
    <transition name="fade">
      <div v-if="modalVisible" class="modal-overlay" @click.self="modalVisible = false">
        <div class="modal-clean-dialog">
          <div class="modal-clean-content">
            <!-- Header -->
            <div class="modal-clean-header bg-primary text-white">
              <h5 class="modal-clean-title">
                {{ modalModel ? `Details for ${modalModel.model}` : 'Result' }}
              </h5>
              <button class="btn-close btn-close-white" @click="modalVisible = false"></button>
            </div>

            <!-- Body -->
            <div class="modal-clean-body px-4 py-3">
              <p v-if="modalMessage" class="text-center text-muted fs-6">{{ modalMessage }}</p>

              <table
                v-if="modalModel && modalFilteredOutputs.length"
                class="table table-hover table-striped table-sm"
              >
                <thead class="table-light">
                  <tr>
                    <th>Input A</th>
                    <th>Records A</th>
                    <th>Input B</th>
                    <th>Records B</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(output, idx) in paginatedModalOutputs" :key="idx">
                    <td>{{ output.inputA }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          Number(output.inputARecords) === Number(output.inputBRecords)
                            ? 'bg-success'
                            : 'bg-danger'
                        "
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
                            ? 'bg-success'
                            : 'bg-danger'
                        "
                      >
                        {{ output.inputBRecords }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          Number(output.attributesWithDifferences) > 0 ? 'bg-danger' : 'bg-success'
                        "
                      >
                        {{ output.attributesWithDifferences }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="modal-clean-footer d-flex justify-content-between">
              <nav v-if="modalTotalPages > 1">
                <ul class="pagination mb-0 pagination-modern">
                  <li class="page-item" :class="{ disabled: modalCurrentPage === 1 }">
                    <button class="page-link rounded-pill" @click="modalPrevPage">Prev</button>
                  </li>
                  <li
                    v-for="p in modalTotalPages"
                    :key="p"
                    class="page-item"
                    :class="{ active: p === modalCurrentPage }"
                  >
                    <button class="page-link rounded-pill" @click="modalCurrentPage = p">
                      {{ p }}
                    </button>
                  </li>
                  <li class="page-item" :class="{ disabled: modalCurrentPage === modalTotalPages }">
                    <button class="page-link rounded-pill" @click="modalNextPage">Next</button>
                  </li>
                </ul>
              </nav>

              <button class="btn btn-secondary" @click="modalVisible = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Props
const props = defineProps({
  apiUrl: { type: String, required: true },
  title: { type: String, default: 'Models' },
  pageSize: { type: Number, default: 5 },
})

// MAIN STATE
const models = ref([])
const loading = ref(false)
const totalModels = ref(0)
const diffModels = ref(0)
const currentPage = ref(1)
const responseTime = ref(null)
const expanded = ref(null)

// SEARCH
const searchTermLocal = ref('')

// MODAL
const modalVisible = ref(false)
const modalMessage = ref('')
const modalModel = ref(null)

// FETCH MODELS
const fetchModels = async () => {
  loading.value = true
  const start = performance.now()
  try {
    const res = await axios.get(props.apiUrl)
    const end = performance.now()
    responseTime.value = Math.round(end - start)

    models.value = res.data.modelDTOs || []
    totalModels.value = res.data.totalModels || models.value.length
    diffModels.value = res.data.diffModels || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
onMounted(fetchModels)

// Toggle expand
const toggle = (modelId) => {
  expanded.value = expanded.value === modelId ? null : modelId
}

// Count diffs
const countDiffs = (model) => {
  return (model.outputDTOList || []).filter(
    (o) =>
      Number(o?.attributesWithDifferences || 0) > 0 ||
      Number(o?.inputARecords || 0) !== Number(o?.inputBRecords || 0),
  ).length
}

// Filtered outputs
const filteredOutputs = (model) =>
  (model.outputDTOList || []).filter(
    (o) =>
      Number(o?.attributesWithDifferences || 0) > 0 ||
      Number(o?.inputARecords || 0) !== Number(o?.inputBRecords || 0),
  )

// Main pagination
const paginatedModels = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return models.value.filter((m) => countDiffs(m) > 0).slice(start, start + props.pageSize)
})

const totalPages = computed(
  () => Math.ceil(models.value.filter((m) => countDiffs(m) > 0).length / props.pageSize) || 1,
)
const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++

// Date formatter
const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

// Search handler
const handleSearch = (event) => {
  if (event.key !== 'Enter') return
  const term = searchTermLocal.value.trim().toLowerCase()
  if (!term) return

  const found = models.value.find((m) => m?.model?.toLowerCase() === term)
  if (!found) {
    modalMessage.value = 'Model not found'
    modalModel.value = null
  } else {
    const hasDiff = countDiffs(found) > 0
    if (!hasDiff) {
      modalMessage.value = 'Model exists but no differences'
      modalModel.value = null
    } else {
      modalModel.value = found
      modalMessage.value = ''
      modalCurrentPage.value = 1
    }
  }
  modalVisible.value = true
}

// Modal pagination
const modalCurrentPage = ref(1)
const modalPageSize = ref(10)
const modalFilteredOutputs = computed(() =>
  (modalModel.value?.outputDTOList || []).filter(
    (o) =>
      Number(o?.attributesWithDifferences || 0) > 0 ||
      Number(o?.inputARecords || 0) !== Number(o?.inputBRecords || 0),
  ),
)
const modalTotalPages = computed(
  () => Math.ceil(modalFilteredOutputs.value.length / modalPageSize.value) || 1,
)
const paginatedModalOutputs = computed(() => {
  const start = (modalCurrentPage.value - 1) * modalPageSize.value
  return modalFilteredOutputs.value.slice(start, start + modalPageSize.value)
})
const modalPrevPage = () => modalCurrentPage.value > 1 && modalCurrentPage.value--
const modalNextPage = () =>
  modalCurrentPage.value < modalTotalPages.value && modalCurrentPage.value++
</script>

<style scoped>
.dashboard-bg {
  background: linear-gradient(to bottom right, #eef2f7, #e3e9f1);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.stat-card {
  background: #fff;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
}
.search-input {
  padding-right: 2.5rem;
}
.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.3rem;
}
.models-list-wrapper {
  flex: 1;
  overflow-y: auto;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-clean-dialog {
  max-width: 820px;
  width: 90%;
  animation: fadeInDown 0.25s ease-out;
}
.modal-clean-content {
  background: #fff;
  border-radius: 10px;
  overflow: visible;
}
.modal-clean-header {
  padding: 1rem 1.4rem;
  border-bottom: 2px solid #dee2e6;
}
.modal-clean-title {
  font-size: 1.15rem;
  font-weight: 600;
}
.modal-clean-body {
  padding: 1rem 1.4rem;
}
.modal-clean-footer {
  padding: 0.8rem 1.4rem;
  border-top: 1px solid #dee2e6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
