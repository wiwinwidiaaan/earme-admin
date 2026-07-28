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

const articles = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

const showForm = ref(false)
const editingId = ref(null)
const form = ref(emptyForm())
const imageFile = ref(null)
const formError = ref('')

const showConfirm = ref(false)
const targetId = ref(null)

function emptyForm() {
  return { title: '', content: '', published_at: '' }
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get('/articles')
    articles.value = data.data
  } catch {
    toast.error('Gagal memuat artikel.')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  form.value = emptyForm()
  imageFile.value = null
  formError.value = ''
  showForm.value = true
}

function openEdit(a) {
  editingId.value = a.id
  form.value = {
    title: a.title,
    content: a.content,
    published_at: a.published_at ? a.published_at.slice(0, 10) : '',
  }
  imageFile.value = null
  formError.value = ''
  showForm.value = true
}

async function submitForm() {
  saving.value = true
  formError.value = ''
  try {
    const fd = new FormData()
    fd.append('title', form.value.title)
    fd.append('content', form.value.content)
    if (form.value.published_at) fd.append('published_at', form.value.published_at)
    if (imageFile.value) fd.append('image', imageFile.value)

    if (editingId.value) {
      fd.append('_method', 'PUT')
      await api.post(`/articles/${editingId.value}`, fd)
      toast.success('Artikel diperbarui.')
    } else {
      await api.post('/articles', fd)
      toast.success('Artikel ditambahkan.')
    }
    showForm.value = false
    await load()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan artikel.'
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
    await api.delete(`/articles/${targetId.value}`)
    toast.success('Artikel dihapus.')
    showConfirm.value = false
    await load()
  } catch {
    toast.error('Gagal menghapus artikel.')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <PageHeader title="Artikel" description="Konten bacaan seputar bahasa isyarat.">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Artikel</button>
      </template>
    </PageHeader>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!articles.length" message="Belum ada artikel." />

    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Terbit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in articles" :key="a.id">
            <td class="title-cell">{{ a.title }}</td>
            <td>{{ a.published_at ? a.published_at.slice(0, 10) : '-' }}</td>
            <td class="row-actions">
              <button class="btn btn-ghost" @click="openEdit(a)">Edit</button>
              <button class="btn btn-danger" @click="confirmDelete(a.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showForm" wide :title="editingId ? 'Edit Artikel' : 'Tambah Artikel'" @close="showForm = false">
      <form class="form-grid" @submit.prevent="submitForm">
        <div class="field">
          <label>Judul</label>
          <input v-model="form.title" class="input" required />
        </div>
        <div class="field">
          <label>Gambar {{ editingId ? '(kosongkan jika tidak diganti)' : '(opsional)' }}</label>
          <input type="file" accept="image/*" class="input" @change="imageFile = $event.target.files[0]" />
        </div>
        <div class="field">
          <label>Tanggal Terbit <span class="hint">(opsional, default sekarang)</span></label>
          <input v-model="form.published_at" type="date" class="input" />
        </div>
        <div class="field">
          <label>Konten</label>
          <textarea v-model="form.content" class="textarea" style="min-height: 220px" required></textarea>
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

    <ConfirmDialog v-if="showConfirm" :loading="deleting" @confirm="handleDelete" @cancel="showConfirm = false" />
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
.title-cell {
  max-width: 420px;
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
}
.form-error {
  background: var(--danger-bg);
  color: var(--danger);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
}
</style>
