<script setup>
defineProps({
  message: { type: String, default: 'Belum ada data.' },
  icon: { type: String, default: '📭' },
})
</script>

<template>
  <div class="empty">
    <div class="icon">{{ icon }}</div>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--text-muted);
  text-align: center;
}
.icon {
  font-size: 32px;
  margin-bottom: 10px;
}
.empty p {
  font-size: 14px;
}
</style>
