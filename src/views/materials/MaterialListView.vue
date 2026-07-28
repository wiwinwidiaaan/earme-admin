<script setup>
import { ref, onMounted } from "vue";
import { api } from "../../lib/api";
import { useToastStore } from "../../stores/toast";
import PageHeader from "../../components/PageHeader.vue";
import LoadingState from "../../components/LoadingState.vue";
import EmptyState from "../../components/EmptyState.vue";
import BaseModal from "../../components/BaseModal.vue";
import ConfirmDialog from "../../components/ConfirmDialog.vue";

const toast = useToastStore();

const materials = ref([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);

const showForm = ref(false);
const editingId = ref(null);
const form = ref(emptyForm());
const imageFile = ref(null);
const formError = ref("");

const showConfirm = ref(false);
const targetId = ref(null);

function emptyForm() {
  return { title: "", content: "", order: 0 };
}

async function load() {
  loading.value = true;
  try {
    const { data } = await api.get("/materials");
    materials.value = data.data;
  } catch {
    toast.error("Gagal memuat materi.");
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = emptyForm();
  imageFile.value = null;
  formError.value = "";
  showForm.value = true;
}

function openEdit(m) {
  editingId.value = m.id;
  form.value = { title: m.title, content: m.content, order: m.order };
  imageFile.value = null;
  formError.value = "";
  showForm.value = true;
}

async function submitForm() {
  saving.value = true;
  formError.value = "";
  try {
    const fd = new FormData();
    fd.append("title", form.value.title);
    fd.append("content", form.value.content);
    fd.append("order", form.value.order ?? 0);
    if (imageFile.value) fd.append("image", imageFile.value);

    if (editingId.value) {
      await api.post(`/materials/${editingId.value}`, fd);
      toast.success("Materi diperbarui.");
    } else {
      await api.post("/materials", fd);
      toast.success("Materi ditambahkan.");
    }
    showForm.value = false;
    await load();
  } catch (e) {
    formError.value = e.response?.data?.message || "Gagal menyimpan materi.";
  } finally {
    saving.value = false;
  }
}

function confirmDelete(id) {
  targetId.value = id;
  showConfirm.value = true;
}

async function handleDelete() {
  deleting.value = true;
  try {
    await api.delete(`/materials/${targetId.value}`);
    toast.success("Materi dihapus.");
    showConfirm.value = false;
    await load();
  } catch {
    toast.error("Gagal menghapus materi.");
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader title="Materi" description="Bacaan seputar SIBI & BISINDO.">
      <template #actions>
        <button class="btn btn-primary" @click="openCreate">
          + Tambah Materi
        </button>
      </template>
    </PageHeader>

    <LoadingState v-if="loading" />
    <EmptyState v-else-if="!materials.length" message="Belum ada materi." />

    <div v-else class="grid">
      <div v-for="m in materials" :key="m.id" class="card material-card">
        <img v-if="m.image_url" :src="m.image_url" alt="" />
        <div class="material-body">
          <h3>{{ m.title }}</h3>
          <p>{{ m.content }}</p>
          <div class="row-actions">
            <button class="btn btn-ghost" @click="openEdit(m)">Edit</button>
            <button class="btn btn-danger" @click="confirmDelete(m.id)">
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal
      v-if="showForm"
      wide
      :title="editingId ? 'Edit Materi' : 'Tambah Materi'"
      @close="showForm = false"
    >
      <form class="form-grid" @submit.prevent="submitForm">
        <div class="field">
          <label>Judul</label>
          <input
            v-model="form.title"
            class="input"
            required
            placeholder="mis. SIBI"
          />
        </div>
        <div class="field">
          <label
            >Gambar
            {{
              editingId ? "(kosongkan jika tidak diganti)" : "(opsional)"
            }}</label
          >
          <input
            type="file"
            accept="image/*"
            class="input"
            @change="imageFile = $event.target.files[0]"
          />
        </div>
        <div class="field">
          <label>Konten</label>
          <textarea
            v-model="form.content"
            class="textarea"
            style="min-height: 200px"
            required
          ></textarea>
        </div>
        <div class="field">
          <label>Urutan</label>
          <input v-model.number="form.order" type="number" class="input" />
        </div>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="showForm = false">
            Batal
          </button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </BaseModal>

    <ConfirmDialog
      v-if="showConfirm"
      :loading="deleting"
      @confirm="handleDelete"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.material-card {
  overflow: hidden;
}
.material-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
}
.material-body {
  padding: 18px;
}
.material-body h3 {
  font-size: 16px;
}
.material-body p {
  color: var(--text-secondary);
  font-size: 13px;
  margin-top: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.row-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
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
