import { Text } from 'slate';
import escapeHtml from 'escape-html';

const serialize = (node: any) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);

    //@ts-ignore
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }

    return string;
  }

  const children = node.children.map((n: any) => serialize(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'block-quote':
      return `<blockquote>${children}</blockquote>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'heading-three':
      return `<h3>${children}</h3>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`;
    case 'image':
      return `<img src="${escapeHtml(node.url)}" alt="${escapeHtml(
        node.alt
      )}" />`;
    default:
      return children;
  }
};

export default serialize;
