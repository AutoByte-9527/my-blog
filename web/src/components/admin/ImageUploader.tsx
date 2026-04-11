import { useState } from 'react';
import { uploadImage } from '../../lib/admin-api';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onUpload(url);
    } catch (err) {
      alert('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 rounded cursor-pointer transition-colors">
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {uploading ? '上传中...' : '📷 添加图片'}
    </label>
  );
}