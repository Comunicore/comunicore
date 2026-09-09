import { FileTypes } from '../types/file.types';

export const extensionFileMap: Record<string, FileTypes> = {
  // Images
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  // Videos
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  avi: 'video',
  // Audio
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  // Documents
  pdf: 'document',
  txt: 'document',
  doc: 'document',
  docx: 'document',
  rtf: 'document',
  // Spreadsheets
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  // Code
  js: 'code',
  ts: 'code',
  tsx: 'code',
  jsx: 'code',
  json: 'code',
  html: 'code',
  css: 'code',
};
