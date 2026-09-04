import { useState } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import { mediaUploadMutation } from '@/shared/api/generated/@tanstack/react-query.gen';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface UploadMediaOptions<TFieldValues extends FieldValues> {
  fieldName: Path<TFieldValues>;
  maxSize?: number;
}

// Maybe this hook is incorrect
export const useUploadMedia = <TFieldValues extends FieldValues>({
  fieldName,
  maxSize = MAX_FILE_SIZE,
}: UploadMediaOptions<TFieldValues>) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const { setValue, setError, clearErrors, watch } =
    useFormContext<TFieldValues>();

  const currentUrls = watch(fieldName);

  const { mutateAsync, isPending, error } = useMutation({
    ...mediaUploadMutation(),
  });

  const uploadFiles = async (files: File[]) => {
    setValidationError(null);
    clearErrors(fieldName);

    const invalidFile = files.find((file) => file.size > maxSize);
    if (invalidFile) {
      const msg = `Файл "${invalidFile.name}" превышает допустимый размер ${maxSize / (1024 * 1024)} МБ`;
      setValidationError(msg);
      setError(fieldName, { type: 'manual', message: msg });
      return;
    }

    try {
      const uploadPromises = files.map((file) =>
        mutateAsync({
          body: {
            content: file,
          },
        }),
      );

      const results = await Promise.all(uploadPromises);

      const newUrls = results
        .map((res) => res.url)
        .filter((url): url is string => typeof url === 'string');

      const existingArray = Array.isArray(currentUrls) ? currentUrls : [];
      const updatedValue = [...existingArray, ...newUrls] as PathValue<
        TFieldValues,
        Path<TFieldValues>
      >;

      setValue(fieldName, updatedValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (error) {
      setError(fieldName, {
        type: 'manual',
        message: `Не удалось загрузить файл(ы). Попробуйте еще раз. (${error instanceof Error ? error.message : 'Неизвестная ошибка'})`,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    uploadFiles(Array.from(files));
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.log('handleDrop called');

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return {
    isUploading: isPending,
    serverError: error,
    validationError,
    handleFileChange,
    handleDrop,
    handleDragOver,
  };
};
