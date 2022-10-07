import {
  Box,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react';

import { SlateImage } from './ImageComponent';
import { SlateLink } from './LinkComponent';
import { css } from '@emotion/css';

export const Element: React.FC<{
  attributes: any;
  children: any;
  element: any;
}> = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <UnorderedList style={style} {...attributes}>
          {children}
        </UnorderedList>
      );
    case 'heading-one':
      return (
        <Heading as={'h1'} style={style} size={'2xl'} {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-two':
      return (
        <Heading as={'h2'} style={style} size={'xl'} {...attributes}>
          {children}
        </Heading>
      );
    case 'heading-three':
      return (
        <Heading as={'h3'} style={style} size={'lg'} {...attributes}>
          {children}
        </Heading>
      );

    case 'list-item':
      return (
        <ListItem style={style} {...attributes}>
          {children}
        </ListItem>
      );
    case 'numbered-list':
      return (
        <OrderedList style={style} {...attributes}>
          {children}
        </OrderedList>
      );

    case 'link':
      return (
        <SlateLink attributes={attributes} element={element}>
          {children}
        </SlateLink>
      );
    case 'image':
      return (
        <Box>
          <SlateImage
            attributes={attributes}
            element={element}
            align={style.textAlign}
          >
            {children}
          </SlateImage>
        </Box>
      );

    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export const Leaf: React.FC<{
  attributes: any;
  children: any;
  leaf: any;
}> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span
      className={
        leaf.text === ''
          ? css`
              padding-left: 0.1px;
            `
          : null
      }
      {...attributes}
    >
      {children}
    </span>
  );
};
