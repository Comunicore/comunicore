import { Ctx } from './ctx.types';
import { Handler, ReturnNewValues, ToolHandlerConfig } from './mdEditor.types';

export class MdEditor {
  static runTool(ctx: Ctx, config: ToolHandlerConfig) {
    const { getValues, textarea } = ctx;
    if (!textarea) return;

    const { wrapper, type } = config;
    const value = getValues('markdown');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const handlers: Record<ToolHandlerConfig['type'], Handler> = {
      heading: ({ text, start, end, wrapper }) =>
        this.addLineStart(text, start, end, wrapper),

      quote: ({ text, wrapper, end, start }) =>
        this.addLineStart(text, start, end, wrapper),

      'o-list': ({ text, start, end }) => this.orderList(text, start, end),

      code: ({ text, start, end, wrapper }) =>
        this.codeHandler(text, start, end, wrapper),

      list: ({ text, start, end, wrapper }) =>
        this.addLineStart(text, start, end, wrapper),

      url: ({ text, start, end }) => this.urlHandler(text, start, end),

      image: ({ text, start, end }) => this.imageHandler(text, start, end),

      wrap: ({ text, start, end, wrapper }) =>
        this.toggleWrap(text, start, end, wrapper),
    };

    const handler = handlers[type];
    if (!handler) return;

    const result = handler({
      text: value,
      start,
      end,
      wrapper,
    });

    this.apply(ctx, result);
  }

  static apply(ctx: Ctx, result: ReturnNewValues) {
    if (!ctx.textarea) return;
    const { setValue, textarea } = ctx;
    const scrollTop = textarea.scrollTop;

    ctx.setValue('markdown', result.newText);
    const newText = result.newText;

    setValue('markdown', newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = result.newStart;
      textarea.selectionEnd = result.newEnd;
      textarea.scrollTop = scrollTop;
    });
  }

  static addLineStart(
    text: string,
    start: number,
    end: number,
    wrapper: string,
  ): ReturnNewValues {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;

    // проверяем, есть ли уже wrapper
    const hasWrapper = text
      .slice(lineStart, lineStart + wrapper.length)
      .startsWith(wrapper);

    // если уже есть — убираем (toggle поведение)
    if (hasWrapper) {
      const afterWrapper =
        text[lineStart + wrapper.length] === ' '
          ? wrapper.length + 1
          : wrapper.length;

      return {
        newText:
          text.slice(0, lineStart) + text.slice(lineStart + afterWrapper),
        newStart: start - afterWrapper,
        newEnd: end - afterWrapper,
      };
    }

    // если нет — добавляем в начало строки
    return {
      newText: text.slice(0, lineStart) + wrapper + ' ' + text.slice(lineStart),
      newStart: start + wrapper.length + 1,
      newEnd: end + wrapper.length + 1,
    };
  }

  static imageHandler(
    text: string,
    start: number,
    end: number,
  ): ReturnNewValues {
    const link = this.findLinkBounds(text, start);
    const isImage = link && text[link.start - 1] === '!';

    if (isImage && link) {
      const linkText = text.slice(link.textStart, link.textEnd);
      return {
        newText:
          text.slice(0, link.start - 1) + linkText + text.slice(link.end),
        newStart: link.start - 1,
        newEnd: link.start - 1 + linkText.length,
      };
    }

    // И добавляем "!" перед открывающей скобкой
    // result.newStart обычно указывает на позицию внутри скобок или после них,
    // поэтому нам нужно найти начало вставки.

    // Но проще переписать логику добавления для image:
    if (start !== end) {
      const selected = text.slice(start, end);
      return {
        newText: text.slice(0, start) + `![${selected}]()` + text.slice(end),
        newStart: start + selected.length + 4,
        newEnd: start + selected.length + 4,
      };
    }

    const {
      word,
      start: wStart,
      end: wEnd,
    } = this.getWordAtCursor(text, start);

    return {
      newText: text.slice(0, wStart) + `![${word}]()` + text.slice(wEnd),
      newStart: wStart + word.length + 2, // Курсор в круглые скобки
      newEnd: wStart + word.length + 2,
    };
  }

  static getWordAtCursor(text: string, cursor: number) {
    let start = cursor;
    let end = cursor;

    while (start > 0 && /\S/.test(text[start - 1])) {
      start--;
    }

    while (end < text.length && /\S/.test(text[end])) {
      end++;
    }

    return {
      word: text.slice(start, end),
      start,
      end,
    };
  }

  static orderList(text: string, start: number, end: number): ReturnNewValues {
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;

    const lineEnd = text.indexOf('\n', start);
    const currentLine = text.slice(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd,
    );

    const match = currentLine.match(/^(\d+)\.\s/);

    // если уже есть список → убрать
    if (match) {
      const removeLength = match[0].length;

      return {
        newText:
          text.slice(0, lineStart) + text.slice(lineStart + removeLength),
        newStart: start - removeLength,
        newEnd: end - removeLength,
      };
    }

    // иначе добавить "1. "
    const prefix = '1. ';

    return {
      newText: text.slice(0, lineStart) + prefix + text.slice(lineStart),
      newStart: start + prefix.length,
      newEnd: end + prefix.length,
    };
  }

  static addImageOnDrop(url: string, alt: string, ctx: Ctx) {
    const { getValues, textarea } = ctx;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = getValues('markdown') || '';

    const mdImageTemplete = `![${alt}](${url})`;

    const newValues: ReturnNewValues = {
      newText: `${text.slice(0, start)} ${mdImageTemplete} ${text.slice(end)}`,
      newStart: start + mdImageTemplete.length + 1,
      newEnd: end + mdImageTemplete.length + 1,
    };

    this.apply(ctx, newValues);
  }

  static restoreSelection(
    editor: HTMLTextAreaElement,
    newStart: number,
    newEnd: number,
  ) {
    requestAnimationFrame(() => {
      editor.focus();
      editor.selectionStart = newStart;
      editor.selectionEnd = newEnd;
    });
  }

  static codeHandler(
    text: string,
    start: number,
    end: number,
    wrapper: string,
  ): ReturnNewValues {
    const selected = text.slice(start, end);
    const hasNewLine = selected.includes('\n');

    // inline code
    if (!hasNewLine) {
      return this.toggleWrap(text, start, end, wrapper);
    }

    const blockWrapper = wrapper.repeat(3); // ```
    const before = text.slice(0, start);
    const after = text.slice(end);

    const hasWrapperBefore = before.endsWith(blockWrapper + '\n');
    const hasWrapperAfter = after.startsWith('\n' + blockWrapper);

    // если уже есть ``` УБИРАЕМ
    if (hasWrapperBefore && hasWrapperAfter) {
      return {
        newText:
          text.slice(0, start - (blockWrapper.length + 1)) + // убрать ```\n
          selected +
          text.slice(end + blockWrapper.length + 1), // убрать \n```
        newStart: start - (blockWrapper.length + 1),
        newEnd: end - (blockWrapper.length + 1),
      };
    }

    // иначе ДОБАВЛЯЕМ
    const insert = `${blockWrapper}\n${selected}\n${blockWrapper}`;

    return {
      newText: before + insert + after,
      newStart: start + blockWrapper.length + 1,
      newEnd: start + insert.length - blockWrapper.length - 1,
    };
  }

  static findLinkBounds(text: string, pos: number) {
    const openBracket = text.lastIndexOf('[', pos);
    const closeBracket = text.indexOf(']', openBracket);
    const openParen = text.indexOf('(', closeBracket);
    const closeParen = text.indexOf(')', openParen);

    if (
      openBracket !== -1 &&
      closeBracket !== -1 &&
      openParen !== -1 &&
      closeParen !== -1 &&
      pos >= openBracket &&
      pos <= closeParen
    ) {
      return {
        start: openBracket,
        end: closeParen + 1,
        textStart: openBracket + 1,
        textEnd: closeBracket,
      };
    }

    return null;
  }

  static urlHandler(text: string, start: number, end: number): ReturnNewValues {
    const link = this.findLinkBounds(text, start);

    // если внутри ссылки УБИРАЕМ
    if (link) {
      const linkText = text.slice(link.textStart, link.textEnd);

      return {
        newText: text.slice(0, link.start) + linkText + text.slice(link.end),
        newStart: link.start,
        newEnd: link.start + linkText.length,
      };
    }

    // иначе добавляем

    if (start !== end) {
      const selected = text.slice(start, end);

      return {
        newText: text.slice(0, start) + `[${selected}]()` + text.slice(end),
        newStart: start + selected.length + 3,
        newEnd: start + selected.length + 3,
      };
    }

    const {
      word,
      start: wStart,
      end: wEnd,
    } = this.getWordAtCursor(text, start);

    if (word.startsWith('http')) {
      return {
        newText: text.slice(0, wStart) + `[](${word})` + text.slice(wEnd),
        newStart: wStart + 1,
        newEnd: wStart + 1,
      };
    }

    return {
      newText: text.slice(0, wStart) + `[${word}]()` + text.slice(wEnd),
      newStart: wStart + word.length + 1,
      newEnd: wStart + word.length + 1,
    };
  }

  static toggleWrap(
    text: string,
    start: number,
    end: number,
    wrapper: string,
  ): ReturnNewValues {
    if (start === end) {
      const word = this.getWordAtCursor(text, start);

      // если слово пустое — вставляем wrapper
      if (word.start === word.end) {
        return {
          newText: text.slice(0, start) + wrapper + wrapper + text.slice(end),
          newStart: start + wrapper.length,
          newEnd: start + wrapper.length,
        };
      }

      return this.toggleWrap(text, word.start, word.end, wrapper);
    }

    const left = text.slice(0, start);
    const right = text.slice(end);
    const leftWrapperOutside = left.endsWith(wrapper);
    const rightWrapperOutside = right.startsWith(wrapper);

    if (leftWrapperOutside && rightWrapperOutside) {
      return {
        newText:
          text.slice(0, start - wrapper.length) +
          text.slice(start, end) +
          text.slice(end + wrapper.length),
        newStart: start - wrapper.length,
        newEnd: end - wrapper.length,
      };
    }

    const leftWrapperInside = text.slice(start, start + wrapper.length);
    const rightWrapperInside = text.slice(end - wrapper.length, end);

    if (
      leftWrapperInside.startsWith(wrapper) &&
      rightWrapperInside.startsWith(wrapper)
    ) {
      return {
        newText:
          text.slice(0, start) +
          text.slice(start + wrapper.length, end - wrapper.length) +
          text.slice(end, text.length),
        newStart: start + wrapper.length,
        newEnd: end - wrapper.length,
      };
    }

    return {
      newText:
        text.slice(0, start) +
        wrapper +
        text.slice(start, end) +
        wrapper +
        text.slice(end),
      newStart: start + wrapper.length,
      newEnd: end + wrapper.length,
    };
  }
}
