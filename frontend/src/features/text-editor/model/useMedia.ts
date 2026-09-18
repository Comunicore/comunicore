'use client';

import { ClipboardEvent, DragEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { mediaUploadMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

export const useMedia = (
  onUploadSuccess?: (url: string, alt: string) => void,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const { mutateAsync: uploadMedia, isPending } = useMutation(
    mediaUploadMutation(),
  );

  const uploadFile = async (file: File) => {
    try {
      const response = await uploadMedia({
        body: { content: file },
      });

      if (response?.url && onUploadSuccess) {
        onUploadSuccess(response.url, response.fileName || 'image');
      }
      return response;
    } catch (error) {
      console.error('Media upload failed:', error);
    }
  };

  // 2. Обработчик вставки
  const handlePaste = async (event: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(event.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith('image/'));

    if (imageItem) {
      event.preventDefault(); // Останавливаем текст, если это картинка
      const file = imageItem.getAsFile();
      if (file) await uploadFile(file);
    }
  };

  // 3. Обработчики Drag-and-Drop
  const handleDragOver = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (imageFile) {
      await uploadFile(imageFile);
    } else {
      console.warn('No image file detected');
    }
  };

  return {
    handleDrop,
    handleDragLeave,
    handleDragOver,
    handlePaste,
    isDragging,
    isUploading: isPending,
  };
};
