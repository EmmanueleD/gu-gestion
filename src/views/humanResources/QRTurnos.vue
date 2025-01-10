<template>
  <div class="card">
    <div class="flex flex-column align-items-center justify-content-start full-height py-8">
      <h1>QR Turnos</h1>
      <div ref="qrcode" class="qr-container"></div>
      <div class="countdown-container">
        <ProgressBar :value="progressValue" :showValue="false" :pt="{
          root: { style: 'height: 2w0px; width: 300px' }
        }" />
        <Badge class="countdown">{{ remainingSeconds }}</Badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import QRCode from 'qrcode';
import ProgressBar from 'primevue/progressbar'; // Import ProgressBar from PrimeVue

const qrcode = ref(null);
const currentQrData = ref('');
const remainingSeconds = ref(0);
let updateInterval;
let countdownInterval;

const progressValue = computed(() => {
  return (((remainingSeconds.value) / 60) * 100).toFixed(0);
});

function formatDateTime(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
    String(date.getHours()).padStart(2, '0'),
    String(date.getMinutes()).padStart(2, '0')
  ].join('');
}

function updateCountdown() {
  const now = new Date();
  remainingSeconds.value = 60 - now.getSeconds();
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
  updateCountdown();

  const seconds = 60 - new Date().getSeconds();

  setTimeout(() => {
    updateQRCode();
    updateInterval = setInterval(updateQRCode, 60 * 1000);
  }, seconds * 1000);

  // Avvia il contatore
  countdownInterval = setInterval(updateCountdown, 1000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQRCode);
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
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

.countdown-container {
  position: relative;
  margin-top: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 500;
}
</style>