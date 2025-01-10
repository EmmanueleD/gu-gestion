<template>
  <div class="card">
    <h5>Escanear QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <video ref="video" autoplay playsinline class="scanner-video"></video>
      <canvas ref="canvas" style="display: none;"></canvas>
      <div v-if="error" class="text-red-500 mt-3">
        {{ error }}
      </div>
      <div v-if="lastScan" class="text-green-500 mt-3">
        Último escaneo: {{ lastScan }}
      </div>
      <button @click="startCamera" class="p-button mt-3">
        Iniciar Cámara
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import QrScanner from 'qr-scanner';

const video = ref(null);
const canvas = ref(null);
const error = ref('');
const lastScan = ref('');
const authStore = useAuthStore();
let stream = null;
let scanInterval = null;

async function startCamera() {
  try {
    // Ferma lo stream precedente se esiste
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    error.value = '';
    
    // Richiedi accesso alla fotocamera posteriore
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    // Collega lo stream al video
    video.value.srcObject = stream;
    
    // Avvia la scansione del QR
    startQRScanning();
    
  } catch (err) {
    if (location.protocol !== 'https:') {
      error.value = 'Esta función requiere HTTPS. Por favor, accede a través de una conexión segura.';
    } else {
      error.value = 'Error al acceder a la cámara: ' + (err.message || 'Permiso denegado');
    }
    console.error('Camera error:', err);
  }
}

function startQRScanning() {
  // Pulisci l'intervallo precedente se esiste
  if (scanInterval) {
    clearInterval(scanInterval);
  }
  
  // Crea un nuovo intervallo per scansionare il video
  scanInterval = setInterval(() => {
    if (!video.value || !canvas.value || !video.value.videoWidth) return;
    
    const ctx = canvas.value.getContext('2d');
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    
    // Cattura un frame dal video
    ctx.drawImage(video.value, 0, 0);
    
    // Prova a decodificare il QR code
    QrScanner.scanImage(canvas.value)
      .then(result => {
        const scanData = {
          qrCode: result,
          userId: authStore.user?.id,
          userEmail: authStore.user?.email,
          username: authStore.user?.username,
          timestamp: new Date().toISOString()
        };
        console.log('Scan result:', scanData);
        lastScan.value = result;
      })
      .catch(() => {
        // Ignora gli errori di scansione (nessun QR trovato)
      });
  }, 1000);
}

onBeforeUnmount(() => {
  // Pulisci l'intervallo quando il componente viene distrutto
  if (scanInterval) {
    clearInterval(scanInterval);
  }
  
  // Ferma lo stream della fotocamera
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
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
}

canvas {
  display: none;
}
</style>
