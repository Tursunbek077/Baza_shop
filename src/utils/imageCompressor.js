/**
 * High-performance client-side image compression utility
 * Resizes large images (e.g. 3-8MB camera shots) to web-optimized dimensions
 * and converts to high-quality compressed WebP/JPEG format (typically 100-200 KB).
 */

export async function compressImage(file, {
  maxWidth = 1200,
  maxHeight = 1600,
  quality = 0.82,
  maxSizeBytes = 250 * 1024, // 250 KB target
} = {}) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Faqat rasm fayllarini yuklashingiz mumkin (JPG, PNG, WEBP).');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Rasmni o‘qishda xatolik yuz berdi.'));

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Rasm ma’lumotini yuklab bo‘lmadi.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Proportional dimension scaling
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if canvas 2D is unavailable
          resolve({
            dataUrl: e.target.result,
            originalSizeKB: Math.round(file.size / 1024),
            compressedSizeKB: Math.round(file.size / 1024),
            width: img.width,
            height: img.height,
          });
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (smaller footprint & alpha support)
        let outputFormat = 'image/webp';
        let currentQuality = quality;
        let dataUrl = canvas.toDataURL(outputFormat, currentQuality);

        // Fallback to JPEG if WebP is not supported by legacy browser
        if (!dataUrl.startsWith('data:image/webp')) {
          outputFormat = 'image/jpeg';
          dataUrl = canvas.toDataURL(outputFormat, currentQuality);
        }

        // Iterative quality reduction if size still exceeds threshold
        let approxBytes = dataUrl.length * 0.75;
        let attempts = 0;
        while (approxBytes > maxSizeBytes && currentQuality > 0.45 && attempts < 4) {
          currentQuality -= 0.12;
          dataUrl = canvas.toDataURL(outputFormat, currentQuality);
          approxBytes = dataUrl.length * 0.75;
          attempts++;
        }

        const originalSizeKB = Math.round(file.size / 1024);
        const compressedSizeKB = Math.round(approxBytes / 1024);

        resolve({
          dataUrl,
          originalSizeKB,
          compressedSizeKB,
          width,
          height,
        });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
