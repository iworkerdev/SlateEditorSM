import { Button, Icon, IconButton } from '@chakra-ui/react';
import { Editor, Element as SlateElement, Transforms } from 'slate';

import React from 'react';
import { useSlate } from 'slate-react';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

export const isMarkActive = (editor: Editor, format: any) => {
  const marks = Editor.marks(editor);
  //@ts-ignore
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (
  editor: Editor,
  format: string,
  blockType = 'type'
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        //@ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};

export const BlockButton: React.FC<{
  format: string;
  icon: any;
  label: string;
}> = ({ format, icon, label }) => {
  const editor = useSlate();
  return (
    <IconButton
      size={'sm'}
      variant={'ghost'}
      aria-label={label}
      icon={<Icon as={icon} />}
      isActive={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    />
  );
};

export const HeadingButton: React.FC<{
  format: string;
  level: number;
}> = ({ format, level }) => {
  const editor = useSlate();

  return (
    <Button
      size={'sm'}
      p={1}
      variant={'ghost'}
      isActive={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      H{level}
    </Button>
  );
};

export const MarkButton: React.FC<{
  format: string;
  icon: any;
  label: string;
}> = ({ format, icon, label }) => {
  const editor = useSlate();
  return (
    <IconButton
      variant={'ghost'}
      size={'sm'}
      icon={<Icon as={icon} />}
      aria-label={label}
      isActive={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </IconButton>
  );
};

export const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      //@ts-ignore
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    //@ts-ignore
    Transforms.wrapNodes(editor, block);
  }
};
