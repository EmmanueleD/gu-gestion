<template>
  <div class="card">
    <h5>Escanear QR Turnos</h5>
    <div class="flex flex-column align-items-center">
      <video ref="video" class="scanner-video"></video>
      <div v-if="error" class="text-red-500 mt-3">
        {{ error }}
      </div>
      <div v-if="lastScan" class="text-green-500 mt-3">
        Último escaneo: {{ lastScan }}
      </div>
      <button @click="startScanner" class="p-button mt-3">
        Iniciar Escáner
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';
import Instascan from 'instascan';

const video = ref(null);
const error = ref('');
const lastScan = ref('');
const authStore = useAuthStore();
let scanner = null;

async function startScanner() {
  try {
    // Ferma lo scanner precedente se esiste
    if (scanner) {
      await scanner.stop();
    }

    error.value = '';
    
    // Crea un nuovo scanner
    scanner = new Instascan.Scanner({
      video: video.value,
      scanPeriod: 5, // Scansiona ogni 5ms
      mirror: false  // Non specchiare l'immagine
    });

    // Gestisci gli eventi di scansione
    scanner.addListener('scan', result => {
      const scanData = {
        qrCode: result,
        userId: authStore.user?.id,
        userEmail: authStore.user?.email,
        username: authStore.user?.username,
        timestamp: new Date().toISOString()
      };
      console.log('Scan result:', scanData);
      lastScan.value = result;
      error.value = '';
    });

    // Ottieni le fotocamere disponibili
    const cameras = await Instascan.Camera.getCameras();
    
    if (cameras.length === 0) {
      throw new Error('No se encontraron cámaras');
    }
    
    // Usa la fotocamera posteriore se disponibile
    const backCamera = cameras.find(camera => camera.name.toLowerCase().includes('back'));
    const selectedCamera = backCamera || cameras[0];
    
    // Avvia lo scanner
    await scanner.start(selectedCamera);

  } catch (err) {
    if (location.protocol !== 'https:') {
      error.value = 'Esta función requiere HTTPS. Por favor, accede a través de una conexión segura.';
    } else {
      error.value = 'Error al iniciar el escáner: ' + (err.message || 'Permiso denegado');
    }
    console.error('Scanner error:', err);
  }
}

onBeforeUnmount(() => {
  if (scanner) {
    scanner.stop();
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
</style>
