/* Đăng ký service worker để dùng offline và cài như ứng dụng (cần https hoặc localhost) */
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
