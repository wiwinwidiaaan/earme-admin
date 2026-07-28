<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../lib/api'
import { useToastStore } from '../../stores/toast'
import PageHeader from '../../components/PageHeader.vue'
import LoadingState from '../../components/LoadingState.vue'
import EmptyState from '../../components/EmptyState.vue'
import BaseModal from '../../components/BaseModal.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue'

const toast = useToastStore()

const entries = ref([])
const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const filterCategory = ref('')

const showForm = ref(false)
const editingId = ref(null)
const form = ref(emptyForm())
const videoFile = ref(null)
const thumbFile = ref(null)
const formError = ref('')

const showConfirm = ref(false)
const targetId = ref(null)

function emptyForm() {
  return { category_id: '', term: '', description: '', order: 0 }
}

async function loadCategories() {
  const { data } = await api.get('/categories')
  categories.value = data.data
}

async function loadEntries() {
  loading.value = true
  try {
    const { data } = await api.get('/dictionary-entries', {
      params: { category_id: filterCategory.value || undefined, per_page: 200 },
    })
    entries.value = data.data
  } catch {
    toast.error('Gagal memuat kosakata.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  videoFile.value = null
  thumbFile.value = null
  formError.value = ''
  showForm.value = true
}

function openEdit(entry) {
  editingId.value = entry.id
  form.value = {
    category_id: entry.category_id,
    term: entry.term,
    description: entry.description || '',
    order: entry.order,
  }
  videoFile.value = null
  thumbFile.value = null
  formError.value = ''
  showForm.value = true
}

function buildFormData() {
  const fd = new FormData()
  fd.append('category_id', form.value.category_id)
  fd.append('term', form.value.term)
  fd.append('description', form.value.description || '')
  fd.append('order', form.value.order ?? 0)
  if (videoFile.value) fd.append('video', videoFile.value)
  if (thumbFile.value) fd.append('thumbnail', thumbFile.value)
  return fd
}

async function submitForm() {
  saving.value = true
  formError.value = ''

  if (!editingId.value && !videoFile.value) {
    formError.value = 'Video wajib diunggah untuk kosakata baru.'
    saving.value = false
    return
  }

  try {
    const fd = buildFormData()
    if (editingId.value) {
      fd.append('_method', 'PUT')
      await api.post(`/dictionary-entries/${editingId.value}`, fd)
      toast.success('Kosakata diperbarui.')
    } else {
      await api.post('/dictionary-entries', fd)
      toast.success('Kosakata ditambahkan.')
    }
    showForm.value = false
    await loadEntries()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan kosakata.'
  } finally {
    saving.value = false
  }
}

function confirmDelete(id) {
  targetId.value = id
  showConfirm.value = true
}

async function handleDelete() {
  deleting.value = true
  try {
    await api.delete(`/dictionary-entries/${targetId.value}`)
    toast.success('Kosakata dihapus.')
    showConfirm.value = false
    await loadEntries()
  } catch {
    toast.error('Gagal menghapus kosakata.')
  } finally {
    deleting.value = false
  }
}

function categoryName(id) {
  return categories.value.find((c) => c.id === id)?.name || '-'
}

onMounted(async () => {
  await loadCategories()
  await loadEntries()
})
</script>

<template>
  <div>
    <PageHeader title="Kosakata" description="Semua entri kamus beserta video peragaannya.">
      <template #actions>
        <select v-model="filterCategory" class="select filter-select" @change="loadEntries">
          <option value="">Semua kategori</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Kosakata</button>
      </template>
    </PageHeader>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!entries.length" message="Belum ada kosakata." />

    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Kata</th>
            <th>Kategori</th>
            <th>Video</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in entries" :key="e.id">
            <td><strong>{{ e.term }}</strong></td>
            <td>{{ categoryName(e.category_id) }}</td>
            <td>
              <a :href="e.video_url" target="_blank" rel="noopener" class="video-link">▶ Lihat</a>
            </td>
            <td class="row-actions">
              <button class="btn btn-ghost" @click="openEdit(e)">Edit</button>
              <button class="btn btn-danger" @click="confirmDelete(e.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showForm" :title="editingId ? 'Edit Kosakata' : 'Tambah Kosakata'" @close="showForm = false">
      <form class="form-grid" @submit.prevent="submitForm">
        <div class="field">
          <label>Kategori</label>
          <select v-model="form.category_id" class="select" required>
            <option value="" disabled>Pilih kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>Kata / Istilah</label>
          <input v-model="form.term" class="input" required placeholder="mis. Kursi" />
        </div>
        <div class="field">
          <label>Video {{ editingId ? '(kosongkan jika tidak diganti)' : '' }}</label>
          <input type="file" accept="video/mp4,video/quicktime" class="input" @change="videoFile = $event.target.files[0]" />
        </div>
        <div class="field">
          <label>Thumbnail <span class="hint">(opsional)</span></label>
          <input type="file" accept="image/*" class="input" @change="thumbFile = $event.target.files[0]" />
        </div>
        <div class="field">
          <label>Deskripsi <span class="hint">(opsional)</span></label>
          <textarea v-model="form.description" class="textarea"></textarea>
        </div>
        <div class="field">
          <label>Urutan</label>
          <input v-model.number="form.order" type="number" class="input" />
        </div>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="showForm = false">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Mengunggah...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </BaseModal>

    <ConfirmDialog
      v-if="showConfirm"
      message="Video dan data kosakata ini akan terhapus permanen."
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<style scoped>
.filter-select {
  width: auto;
}
.table-wrap {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}
td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 13.5px;
  vertical-align: middle;
}
tr:last-child td {
  border-bottom: none;
}
.video-link {
  color: var(--teal-600);
  font-weight: 600;
}
.row-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}
.form-error {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
</style>
