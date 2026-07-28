<script setup>
import { useToastStore } from '../stores/toast'

const toast = useToastStore()
</script>

<template>
  <div class="toast-stack">
    <TransitionGroup name="toast">
      <div v-for="t in toast.items" :key="t.id" class="toast" :class="t.type">
        <span>{{ t.type === 'success' ? '✓' : '✕' }}</span>
        <p>{{ t.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 200;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: 13.5px;
  font-weight: 500;
  min-width: 240px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.toast span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  flex-shrink: 0;
}
.toast.success span { background: var(--success); }
.toast.error span { background: var(--danger); }

.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
