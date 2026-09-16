import { extensionFileMap } from '../../config/extensions-file-map';
import { FileTypes } from '../../types/file.types';

export const getFileType = (url: string): FileTypes => {
  const cleanUrl = url.split('?')[0].split('#')[0];
  const extension = cleanUrl.split('.').pop()?.toLowerCase();

  if (!extension) return 'file';

  return extensionFileMap[extension] ?? 'file';
};
