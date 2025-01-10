<template>
  <div class="card">
    <div class="flex flex-column align-items-center justify-content-start full-height py-8">
      <h1>QR Turnos</h1>
      <div ref="qrcode" class="qr-container"></div>
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
    const qrUrl = await QRCode.toDataURL(currentQrData.value, {
      width: Math.min(500, Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9)),
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

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
  // Aggiorna il QR code quando la finestra viene ridimensionata
  window.addEventListener('resize', updateQRCode);

  updateQRCode();

  const seconds = 60 - new Date().getSeconds();

  setTimeout(() => {
    updateQRCode();
    updateInterval = setInterval(updateQRCode, 60 * 1000);
  }, seconds * 1000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQRCode);
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
</script>

<style scoped>
.card {
  padding: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.full-height {
  height: 100%;
  width: 100%;
}

.qr-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.qr-container img {
  width: min(90vmin, 500px);
  height: min(90vmin, 500px);
  max-width: 500px;
  max-height: 500px;
  object-fit: contain;
}
</style>