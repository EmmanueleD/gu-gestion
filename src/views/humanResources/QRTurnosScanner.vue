<template>
  <div class="card">
    <h5>Escanear QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <qrcode-stream 
        v-if="isScanning && !showSuccess"
        @decode="onDecode"
        @init="onInit"
        :track="paintOutline"
        class="scanner-video"
      />
      <Transition name="slide">
        <div v-if="showSuccess" class="success-screen">
          <div class="success-content">
            <i class="pi pi-check-circle" style="font-size: 4rem;"></i>
            <h2>¡Escaneado con éxito!</h2>
            <div class="scan-info">
              <p><strong>Fecha y Hora:</strong> {{ formatDateTime(lastScan) }}</p>
              <p><strong>Usuario:</strong> {{ authStore.user?.username }}</p>
              <p><strong>Email:</strong> {{ authStore.user?.email }}</p>
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
import { ref } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import { useAuthStore } from '@/stores/useAuthStore';

const error = ref('');
const lastScan = ref('');
const isScanning = ref(false);
const showSuccess = ref(false);
const authStore = useAuthStore();

function toggleScanner() {
  isScanning.value = !isScanning.value;
  if (!isScanning.value) {
    error.value = '';
  }
}

function formatDateTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
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
  const scanData = {
    qrCode: result,
    userId: authStore.user?.id,
    userEmail: authStore.user?.email,
    username: authStore.user?.username,
    timestamp: new Date().toISOString()
  };
  console.log('Scan result:', scanData);
  lastScan.value = scanData.timestamp;
  showSuccess.value = true;

  // Nascondi la schermata di successo dopo 3 secondi
  setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
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
  position: absolute;
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

.success-content h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: white;
}

.scan-info {
  text-align: left;
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
