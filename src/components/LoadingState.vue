<template>
  <div class="loading">
    <div class="spinner" />
    <p>Memuat data...</p>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: var(--text-muted);
  gap: 12px;
}
.spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--teal-100);
  border-top-color: var(--teal-500);
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
