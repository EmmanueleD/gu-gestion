<template>
  <div class="card">
    <h5>QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <div ref="qrcode" class="mb-3"></div>
      <div class="text-center">
        <p>Escanea el código QR para registrar tu entrada/salida</p>
        <button @click="showQRInfo" class="p-button p-button-secondary mt-3">
          Ver información QR
        </button>
        <pre>{{ currentQrData }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import QRCode from 'qrcode';

const qrcode = ref(null);
const currentQrData = ref('');
let updateInterval;

function formatDateTime(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0')
  ].join('');
}

async function updateQRCode() {
  try {
    currentQrData.value = formatDateTime(new Date());
    const qrUrl = await QRCode.toDataURL(currentQrData.value);

    if (qrcode.value) {
      const img = document.createElement('img');
      img.src = qrUrl;
      qrcode.value.innerHTML = '';
      qrcode.value.appendChild(img);
    }
  } catch (err) {
    console.error('Error generando QR:', err);
  }
}

function showQRInfo() {
  console.log('Información del QR:', currentQrData.value);
}

onMounted(() => {
  updateQRCode();


  const seconds = 60 - new Date().getSeconds();


  setTimeout(() => {
    updateQRCode();
    updateInterval = setInterval(updateQRCode, 60 * 1000);
  }, seconds * 1000);
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
.card {
  padding: 2rem;
}

img {
  max-width: 300px;
  height: auto;
}
</style>