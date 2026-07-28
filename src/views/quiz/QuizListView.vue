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

const questions = ref([])
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
  return {
    question_text: '',
    order: 0,
    options: [
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ],
  }
}

async function load() {
  loading.value = true
  try {
    const { data } = await api.get('/quiz-questions')
    questions.value = data.data
  } catch {
    toast.error('Gagal memuat soal kuis.')
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

function openEdit(q) {
  editingId.value = q.id
  form.value = {
    question_text: q.question_text,
    order: q.order,
    options: q.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct })),
  }
  imageFile.value = null
  formError.value = ''
  showForm.value = true
}

function setCorrect(index) {
  form.value.options.forEach((o, i) => {
    o.is_correct = i === index
  })
}

async function submitForm() {
  formError.value = ''

  if (form.value.options.some((o) => !o.option_text.trim())) {
    formError.value = 'Semua 4 pilihan jawaban wajib diisi.'
    return
  }
  if (!form.value.options.some((o) => o.is_correct)) {
    formError.value = 'Pilih salah satu jawaban yang benar.'
    return
  }

  saving.value = true
  try {
    const fd = new FormData()
    fd.append('question_text', form.value.question_text)
    fd.append('order', form.value.order ?? 0)
    form.value.options.forEach((o, i) => {
      fd.append(`options[${i}][option_text]`, o.option_text)
      fd.append(`options[${i}][is_correct]`, o.is_correct ? '1' : '0')
    })
    if (imageFile.value) fd.append('image', imageFile.value)

    if (editingId.value) {
      fd.append('_method', 'PUT')
      await api.post(`/quiz-questions/${editingId.value}`, fd)
      toast.success('Soal diperbarui.')
    } else {
      await api.post('/quiz-questions', fd)
      toast.success('Soal ditambahkan.')
    }
    showForm.value = false
    await load()
  } catch (e) {
    formError.value = e.response?.data?.message || 'Gagal menyimpan soal.'
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
    await api.delete(`/quiz-questions/${targetId.value}`)
    toast.success('Soal dihapus.')
    showConfirm.value = false
    await load()
  } catch {
    toast.error('Gagal menghapus soal.')
  } finally {
    deleting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <PageHeader title="Kuis" description="Bank soal untuk fitur kuis di app.">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">+ Tambah Soal</button>
      </template>
    </PageHeader>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!questions.length" message="Belum ada soal kuis." />

    <div v-else class="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Pertanyaan</th>
            <th>Jawaban Benar</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in questions" :key="q.id">
            <td class="question-cell">{{ q.question_text }}</td>
            <td>
              <span class="badge badge-teal">
                {{ q.options.find((o) => o.is_correct)?.option_text || '-' }}
              </span>
            </td>
            <td class="row-actions">
              <button class="btn btn-ghost" @click="openEdit(q)">Edit</button>
              <button class="btn btn-danger" @click="confirmDelete(q.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showForm" wide :title="editingId ? 'Edit Soal' : 'Tambah Soal'" @close="showForm = false">
      <form class="form-grid" @submit.prevent="submitForm">
        <div class="field">
          <label>Pertanyaan</label>
          <textarea v-model="form.question_text" class="textarea" required></textarea>
        </div>
        <div class="field">
          <label>Gambar {{ editingId ? '(kosongkan jika tidak diganti)' : '(opsional)' }}</label>
          <input type="file" accept="image/*" class="input" @change="imageFile = $event.target.files[0]" />
        </div>

        <div class="field">
          <label>Pilihan Jawaban <span class="hint">(pilih radio di sebelah jawaban yang benar)</span></label>
          <div v-for="(opt, i) in form.options" :key="i" class="option-row">
            <input
              type="radio"
              :name="'correct-option'"
              :checked="opt.is_correct"
              @change="setCorrect(i)"
            />
            <input v-model="opt.option_text" class="input" :placeholder="`Pilihan ${i + 1}`" required />
          </div>
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
.question-cell {
  max-width: 420px;
}
.badge-teal {
  background: var(--teal-100);
  color: var(--teal-700);
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
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.option-row input[type='radio'] {
  width: 18px;
  height: 18px;
  accent-color: var(--teal-500);
  flex-shrink: 0;
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
