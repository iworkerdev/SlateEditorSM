/** @jsx jsx */

import { jsx } from 'slate-hyperscript';

const deserialize = (el: any, markAttributes = {}): any => {
  if (el.nodeType === Node.TEXT_NODE) {
    return jsx('text', markAttributes, el.textContent);
  } else if (el.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes = { ...markAttributes };

  const children = Array.from(el.childNodes)
    .map(node => deserialize(node, nodeAttributes))
    .flat();

  // define attributes for text nodes
  switch (el.nodeName) {
    case 'strong':
      //@ts-ignore
      nodeAttributes.bold = true;
  }

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''));
  }

  switch (el.tagName.toLowerCase()) {
    case 'p':
      return jsx('element', { type: 'paragraph' }, children);
    case 'br':
      return '\n';
    case 'h1':
      return jsx('element', { type: 'heading-one' }, children);
    case 'h2':
      return jsx('element', { type: 'heading-two' }, children);
    case 'h3':
      return jsx('element', { type: 'heading-three' }, children);
    case 'h4':
      return jsx('element', { type: 'heading-four' }, children);
    case 'h5':
      return jsx('element', { type: 'heading-five' }, children);
    case 'h6':
      return jsx('element', { type: 'heading-six' }, children);
    case 'li':
      return jsx('element', { type: 'list-item' }, children);
    case 'ol':
      return jsx('element', { type: 'numbered-list' }, children);
    case 'ul':
      return jsx('element', { type: 'bulleted-list' }, children);
    case 'blockquote':
      return jsx('element', { type: 'block-quote' }, children);
    case 'a':
      return jsx(
        'element',
        { type: 'link', url: el.getAttribute('href') },
        children
      );
    case 'img':
      return jsx(
        'element',
        { type: 'image', url: el.getAttribute('src') },
        children
      );
    default:
      return children;
  }
};

export default deserialize;
