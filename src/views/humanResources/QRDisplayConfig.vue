<template>
    <div class="card">
        <h5>Configurar Pantalla QR</h5>
        <div class="flex flex-column gap-3">
            <div class="alert alert-info">
                Esta página permite configurar qué dispositivos pueden mostrar el código QR para el registro de turnos.
                Configure esto solo en los dispositivos que estarán en la oficina mostrando el código QR.
            </div>

            <div v-if="!qrTokenStore.hasValidToken()" class="flex flex-column gap-2">
                <Button label="Autorizar este dispositivo" icon="pi pi-check" 
                    @click="generateToken" />
            </div>
            <div v-else class="flex flex-column gap-2">
                <div class="alert alert-success">
                    Este dispositivo está autorizado para mostrar el código QR.
                </div>
                <Button label="Revocar autorización" icon="pi pi-times" 
                    severity="danger" @click="revokeToken" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useQRTokenStore } from '@/stores/useQRTokenStore';
import { v4 as uuidv4 } from 'uuid';

const qrTokenStore = useQRTokenStore();

function generateToken() {
    const token = uuidv4();
    qrTokenStore.setToken(token);
}

function revokeToken() {
    qrTokenStore.clearToken();
}
</script>

<style scoped>
.alert {
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
}

.alert-info {
    background-color: var(--blue-50);
    border: 1px solid var(--blue-200);
    color: var(--blue-900);
}

.alert-success {
    background-color: var(--green-50);
    border: 1px solid var(--green-200);
    color: var(--green-900);
}
</style>
