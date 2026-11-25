/* Mỗi phiên đang dùng bản cũ tải lại đúng một lần sau khi SW mới kiểm soát. */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  const existingController = navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (existingController && !reloading) {
      reloading = true;
      location.reload();
    }
  });
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
