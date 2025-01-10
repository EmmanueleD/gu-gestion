import { defineStore } from 'pinia';

export const useQRTokenStore = defineStore('qrToken', {
    state: () => ({
        token: localStorage.getItem('qr_display_token') || null,
    }),
    
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('qr_display_token', token);
        },
        
        clearToken() {
            this.token = null;
            localStorage.removeItem('qr_display_token');
        },
        
        hasValidToken() {
            return !!this.token;
        }
    }
});
