import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { MarkDownSchema } from './markdown.schema';

export type MarkdownGetValue = UseFormGetValues<MarkDownSchema>;
export type MarkdownSetValue = UseFormSetValue<MarkDownSchema>;

export type Ctx = {
  getValues: MarkdownGetValue;
  setValue: MarkdownSetValue;
  textarea: HTMLTextAreaElement | null;
};
