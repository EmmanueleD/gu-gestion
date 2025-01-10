<template>
  <div class="card">
    <h5>Escanear QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <qrcode-stream 
        v-if="isScanning"
        @decode="onDecode"
        @init="onInit"
        :track="paintOutline"
        class="scanner-video"
      />
      <div v-if="error" class="text-red-500 mt-3">
        {{ error }}
      </div>
      <div v-if="lastScan" class="text-green-500 mt-3">
        Último escaneo: {{ lastScan }}
      </div>
      <button @click="toggleScanner" class="p-button mt-3">
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
const authStore = useAuthStore();

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
  const scanData = {
    qrCode: result,
    userId: authStore.user?.id,
    userEmail: authStore.user?.email,
    username: authStore.user?.username,
    timestamp: new Date().toISOString()
  };
  console.log('Scan result:', scanData);
  lastScan.value = result;
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
</style>
