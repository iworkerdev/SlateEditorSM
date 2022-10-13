import { BiLink, BiUnlink } from 'react-icons/bi';
import { CustomEditor, LinkElement } from './CustomTypes';
import { Editor, Range, Element as SlateElement, Transforms } from 'slate';
import { HStack, Icon, IconButton, Link } from '@chakra-ui/react';
import React, { MouseEvent } from 'react';
import { useSelected, useSlate } from 'slate-react';

import UrlInputPopOver from './UrlInputPopOver';
import { css } from '@emotion/css';

export const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={css`
      font-size: 0;
    `}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
);

export const unwrapLink = (editor: CustomEditor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

export const isLinkActive = (editor: CustomEditor) => {
  //@ts-ignore
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
  return !!link;
};

export const wrapLink = (editor: CustomEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export const insertLink = (editor: CustomEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const SlateLink: React.FC<{
  attributes: any;
  children?: React.ReactNode;
  element: any;
}> = ({ attributes, children, element }) => {
  const selected = useSelected();
  return (
    <Link
      {...attributes}
      color={selected ? 'blue.600' : 'blue.600'}
      fontWeight={500}
      target="_blank"
      href={element.url}
      className={
        selected
          ? css`
              box-shadow: 0 0 0 3px #ddd;
            `
          : ''
      }
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </Link>
  );
};

const LinkComponent = () => {
  const editor = useSlate();

  const handleAddLink = (event: MouseEvent<HTMLButtonElement>, url: string) => {
    event.preventDefault();

    if (!url) return;
    insertLink(editor, url);
  };

  const handleRemoveLink = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isLinkActive(editor)) {
      unwrapLink(editor);
    }
  };

  return (
    <HStack>
      <UrlInputPopOver
        inputPlaceHolder="Enter a URL"
        onLinkAdd={handleAddLink}
        icon={BiLink}
        isActive={isLinkActive(editor)}
        errorMessage="Invalid URL"
      />

      <IconButton
        variant={'ghost'}
        size={'sm'}
        aria-label="unlink"
        isActive={isLinkActive(editor)}
        icon={<Icon as={BiUnlink} />}
        onMouseDown={handleRemoveLink}
      />
    </HStack>
  );
};

export default LinkComponent;
