import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';

function imageOrientation(image: any) {
  var img = new Image();
  img.src = image;
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export const imageCompressionFile = async (image: any) => {
  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
  };

  let { width, height } = imageOrientation(URL.createObjectURL(image));
  let compress_file;

  if (width > height) {
    if (width > 400) {
      // landscape
      let compressedFile = await imageCompression(image, options);
      compress_file = await compressedFile;
    } else {
      // No landscape
      compress_file = await image;
    }
  } else if (width < height) {
    // portrait
    if (height > 400) {
      let compressedFile = await imageCompression(image, options);
      compress_file = await compressedFile;
    } else {
      // No portrait
      compress_file = await image;
    }
  } else {
    const compressedFile = await imageCompression(image, options);
    compress_file = await compressedFile;
  }
  return await compress_file;
};

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

export const beforeUpload = (file: RcFile) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/svg+xml';
  if (!isJpgOrPng) {
    message.error('Solo puedes subir archivos JPG/PNG/SVG/WebP');
  }
  const isLt2M = file.size / 1024 / 1024 < 3;
  if (!isLt2M) {
    message.error('La imagen debe ser menor a 3MB');
  }
  return isJpgOrPng && isLt2M;
};
