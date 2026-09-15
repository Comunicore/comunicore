import { KeyboardEvent } from 'react';

import { Ctx } from './ctx.types';
import { MdEditor } from './MdEditor';
import { MdTools, ToolsName } from './mdTools.types';

export class MdEditorKeyBoard extends MdEditor {
  static orderListHandler(event: KeyboardEvent, ctx: Ctx): boolean {
    const { getValues, setValue, textarea } = ctx;
    if (!textarea) return true;

    const text = getValues('markdown');
    const cursor = textarea.selectionStart;

    const lineStart = text.lastIndexOf('\n', cursor - 1) + 1;
    const lineEnd = text.indexOf('\n', cursor);
    const currentLine = text.slice(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd,
    );

    // ищем "1. ", "2. " и т.д.
    const match = currentLine.match(/^(\d+)\.\s/);

    if (!match) return true;

    event.preventDefault();

    const currentNumber = Number(match[1]);

    // если строка пустая → выйти из списка
    if (currentLine.trim() === `${currentNumber}.`) {
      const removeLength = match[0].length;

      const newText =
        text.slice(0, lineStart) + text.slice(lineStart + removeLength);

      setValue('markdown', newText);
      this.restoreSelection(textarea, lineStart, lineStart);
      return true;
    }

    // иначе → продолжаем список
    const nextNumber = currentNumber + 1;
    const prefix = `\n${nextNumber}. `;

    const newText = text.slice(0, cursor) + prefix + text.slice(cursor);

    const newCursor = cursor + prefix.length;

    setValue('markdown', newText);
    this.restoreSelection(textarea, newCursor, newCursor);
    return true;
  }

  static lineHandler(event: KeyboardEvent, ctx: Ctx, wrapper: string): boolean {
    const { getValues, setValue, textarea } = ctx;
    if (!textarea) return false;

    const text = getValues('markdown');
    const start = textarea.selectionStart;

    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', start);
    const currentLine = text.slice(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd,
    );

    const currentWrapper = `${wrapper} `;

    if (currentLine.trim() === wrapper) {
      event.preventDefault();
      const newText =
        text.slice(0, lineStart) +
        text.slice(lineStart + currentWrapper.length);

      setValue('markdown', newText);
      this.restoreSelection(textarea, lineStart, lineStart);
      return true;
    }

    // если есть список → продолжаем список
    if (currentLine.startsWith(currentWrapper)) {
      event.preventDefault();
      const insertPos = start;

      const newText =
        text.slice(0, insertPos) +
        '\n' +
        currentWrapper +
        text.slice(insertPos);

      const cursor = insertPos + currentWrapper.length + 1;

      setValue('markdown', newText);
      this.restoreSelection(textarea, cursor, cursor);
      return true;
    }

    return false;
  }

  static handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>,
    ctx: Ctx,
    toolsMap: Map<ToolsName, MdTools>,
  ) {
    if (event.code === 'Enter') {
      const handleList = this.lineHandler(event, ctx, '-');
      if (handleList) return;

      const handleQuote = this.lineHandler(event, ctx, '>');
      if (handleQuote) return;

      const handledOrdered = this.orderListHandler(event, ctx);
      if (handledOrdered) return;
      return;
    }

    if (!event.ctrlKey) return;

    switch (event.code) {
      case 'KeyB':
        event.preventDefault();
        const boldTool = toolsMap.get('Bold');
        boldTool?.toolFn(ctx);
        break;

      case 'KeyI':
        event.preventDefault();
        const ItalicTool = toolsMap.get('Italic');
        ItalicTool?.toolFn(ctx);
        break;

      case 'KeyH':
        event.preventDefault();
        const HeadingTool = toolsMap.get('Heading');
        HeadingTool?.toolFn(ctx);
        break;
    }
  }
}
