const maxImageFileSize = 2 * 1024 * 1024;
const allowedImageTypes = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp']);

export const validateImageFile = (file: File): void => {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error('Please upload a PNG, JPG, JPEG, or WEBP image');
  }

  if (file.size > maxImageFileSize) {
    throw new Error('Image size must be 2MB or smaller');
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  validateImageFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string' || !reader.result.startsWith('data:image/')) {
        reject(new Error('Selected file could not be converted to an image'));
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error('Unable to read selected file'));
    reader.readAsDataURL(file);
  });
};
