<script setup>
defineProps({
  title: { type: String, required: true },
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @mousedown.self="emit('close')">
      <div class="modal" :class="{ wide }" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="close-btn" @click="emit('close')" aria-label="Tutup">✕</button>
        </div>
        <div class="modal-body">
          <slot />
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
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px;
  overflow-y: auto;
  z-index: 100;
  animation: fadeIn 0.15s ease;
}

.modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 480px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.18s ease;
}

.modal.wide {
  max-width: 680px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.close-btn {
  background: var(--bg);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: var(--text-secondary);
  font-size: 14px;
}
.close-btn:hover {
  background: var(--border);
}

.modal-body {
  padding: 24px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
