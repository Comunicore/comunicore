export interface ReturnNewValues {
  newText: string;
  newStart: number;
  newEnd: number;
}

export type ToolHandlerConfig = {
  wrapper: string;
  type:
    | 'wrap'
    | 'heading'
    | 'list'
    | 'o-list'
    | 'quote'
    | 'code'
    | 'url'
    | 'image';
};

export type HandlerParams = {
  text: string;
  start: number;
  end: number;
  wrapper: string;
};

export type Handler = (params: HandlerParams) => ReturnNewValues;
