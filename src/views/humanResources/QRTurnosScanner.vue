<template>
  <div class="card">
    <h5>Escanear QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <qrcode-stream v-if="isScanning && !showSuccess" @detect="onDecode" @init="onInit" :track="paintOutline"
        class="scanner-video" />

      <Transition name="slide">
        <div v-if="showSuccess" class="success-screen">
          <div class="success-content">
            <i class="pi pi-check-circle" style="font-size: 3rem;"></i>
            <div class="scan-info">
              <p class="font-bold" style="font-size: 2rem;">{{ scanData.username }}</p>
              <p class="font-bold" style="font-size: 5rem;">{{ useDateFormat(scanData.timestamp, 'HH:mm').value }}</p>
              <p class="font-bold" style="font-size: 2rem;">{{ useDateFormat(scanData.timestamp, 'DD/MM/YYYY').value }}
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="error" class="text-red-500 mt-3">
        {{ error }}
      </div>

      <button @click="toggleScanner" class="p-button mt-3" :disabled="showSuccess">
        {{ isScanning ? 'Detener Escáner' : 'Iniciar Escáner' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDateFormat } from '@vueuse/core';

const error = ref('');
const isScanning = ref(true);
const showSuccess = ref(false);
const authStore = useAuthStore();

const scanData = reactive({
  qrCode: '',
  userId: '',
  userEmail: '',
  username: '',
  timestamp: ''
});


function toggleScanner() {
  isScanning.value = !isScanning.value;
  if (!isScanning.value) {
    error.value = '';
  }
}

async function onInit(promise) {
  try {
    await promise;
    error.value = '';
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      error.value = 'ERROR: necesita dar permiso de cámara';
    } else if (err.name === 'NotFoundError') {
      error.value = 'ERROR: no se encontró ninguna cámara';
    } else if (err.name === 'NotSupportedError') {
      error.value = 'ERROR: HTTPS necesario';
    } else if (err.name === 'NotReadableError') {
      error.value = 'ERROR: ¿está la cámara en uso?';
    } else if (err.name === 'OverconstrainedError') {
      error.value = 'ERROR: cámara no compatible';
    } else {
      error.value = 'ERROR: error al iniciar la cámara';
    }
    console.error(err);
  }
}

function onDecode(result) {
  // Aggiorna i dati della scansione
  scanData.qrCode = result;
  scanData.userId = authStore.user?.id || '';
  scanData.userEmail = authStore.user?.email || '';
  scanData.username = authStore.profile?.username || '';
  scanData.timestamp = new Date().toISOString();

  console.log('Scan result:', scanData);

  // Mostra la schermata di successo
  showSuccess.value = true;

  // Nascondi la schermata dopo 5 secondi
  setTimeout(() => {
    showSuccess.value = false;
    isScanning.value = false;
  }, 5000);
}

function paintOutline(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y);
    }
    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.stroke();
  }
}
</script>

<style scoped>
.card {
  padding: 2rem;
  position: relative;
  overflow: hidden;
  min-height: 500px;
}

.scanner-video {
  width: 100%;
  max-width: 400px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.success-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1000;
}

.success-content {
  text-align: center;
  padding: 2rem;
}

.success-content i {
  margin-bottom: 1rem;
}

.scan-info {
  text-align: center;
  font-size: 1.2rem;
}

.scan-info p {
  margin: 0.5rem 0;
  color: white;
}

/* Animazioni */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from {
  transform: translateY(100%);
}

.slide-leave-to {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}
</style>
