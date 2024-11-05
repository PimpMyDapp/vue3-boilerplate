export default defineNuxtPlugin(() => {
    if (process.client && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        // Redirect to HTTPS
        window.location.href = `https://${window.location.host}${window.location.pathname}`;
    }
});
