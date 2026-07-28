<script setup>
defineProps({
  title: { type: String, default: 'Hapus data ini?' },
  message: { type: String, default: 'Tindakan ini tidak bisa dibatalkan.' },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @mousedown.self="emit('cancel')">
      <div class="dialog" role="alertdialog" aria-modal="true">
        <div class="icon">⚠️</div>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="actions">
          <button class="btn btn-ghost" @click="emit('cancel')" :disabled="loading">Batal</button>
          <button class="btn btn-danger" @click="emit('confirm')" :disabled="loading">
            {{ loading ? 'Menghapus...' : 'Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(14, 54, 52, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 110;
}
.dialog {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 28px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-lg);
}
.icon {
  font-size: 28px;
  margin-bottom: 8px;
}
.dialog p {
  color: var(--text-secondary);
  margin-top: 6px;
  font-size: 13.5px;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.actions .btn {
  flex: 1;
}
</style>
