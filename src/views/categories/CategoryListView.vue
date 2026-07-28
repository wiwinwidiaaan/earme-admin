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

const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

const showForm = ref(false)
const editingId = ref(null)
const form = ref(emptyForm())
const formError = ref('')

const showConfirm = ref(false)
const targetId = ref(null)

function emptyForm() {
  return { name: '', section: 'direktori', icon_path: '', description: '', order: 0 }
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get('/categories')
    categories.value = data.data
  } catch {
    toast.error('Gagal memuat kategori.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  formError.value = ''
  showForm.value = true
}

function openEdit(category) {
  editingId.value = category.id
  form.value = {
    name: category.name,
    section: category.section,
    icon_path: category.icon_url || '',
    description: category.description || '',
    order: category.order,
  }
  formError.value = ''
  showForm.value = true
}

async function submitForm() {
  saving.value = true
  formError.value = ''
  try {
    if (editingId.value) {
      await api.put(`/categories/${editingId.value}`, form.value)
      toast.success('Kategori diperbarui.')
    } else {
      await api.post('/categories', form.value)
      toast.success('Kategori ditambahkan.')
    }
    showForm.value = false
    await load()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan kategori.'
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
    await api.delete(`/categories/${targetId.value}`)
    toast.success('Kategori dihapus.')
    showConfirm.value = false
    await load()
  } catch {
    toast.error('Gagal menghapus kategori.')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <PageHeader title="Kategori" description="Kelompok kosakata: Direktori (Kata Tanya, Kata Benda) & Kategori (Abjad, Angka, Ekspresi).">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Kategori</button>
      </template>
    </PageHeader>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!categories.length" message="Belum ada kategori. Tambahkan yang pertama." />

    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Section</th>
            <th>Jumlah Kosakata</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td>
              <strong>{{ c.name }}</strong>
              <span class="slug">/{{ c.slug }}</span>
            </td>
            <td><span class="badge" :class="c.section === 'direktori' ? 'badge-teal' : 'badge-clay'">{{ c.section }}</span></td>
            <td>{{ c.entries_count ?? 0 }}</td>
            <td class="row-actions">
              <button class="btn btn-ghost" @click="openEdit(c)">Edit</button>
              <button class="btn btn-danger" @click="confirmDelete(c.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showForm" :title="editingId ? 'Edit Kategori' : 'Tambah Kategori'" @close="showForm = false">
      <form class="form-grid" @submit.prevent="submitForm">
        <div class="field">
          <label>Nama</label>
          <input v-model="form.name" class="input" required placeholder="mis. Kata Benda" />
        </div>
        <div class="field">
          <label>Section</label>
          <select v-model="form.section" class="select">
            <option value="direktori">Direktori</option>
            <option value="kategori">Kategori</option>
          </select>
        </div>
        <div class="field">
          <label>Icon URL <span class="hint">(opsional)</span></label>
          <input v-model="form.icon_path" class="input" placeholder="https://..." />
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
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </BaseModal>

    <ConfirmDialog
      v-if="showConfirm"
      title="Hapus kategori ini?"
      message="Semua kosakata di dalamnya akan ikut terhapus."
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<style scoped>
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
.slug {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}
.badge-teal {
  background: var(--teal-100);
  color: var(--teal-700);
}
.badge-clay {
  background: var(--clay-light);
  color: var(--clay-dark);
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
