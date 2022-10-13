import { BlockButton, HeadingButton, MarkButton } from './EditorButton';
import { HStack, Stack, StackDivider } from '@chakra-ui/react';
import {
  MdCode,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatUnderlined,
} from 'react-icons/md';

import ImageComponent from './ImageComponent';
import LinkComponent from './LinkComponent';
import React from 'react';

const ToolBar = () => {
  const ref = React.useRef();

  return (
    <Stack
      spacing={1}
      py={1}
      borderTopRadius={'4px'}
      divider={<StackDivider borderColor="gray.200" />}
    >
      <HStack px={2}>
        <HeadingButton format="heading-one" level={1} />
        <HeadingButton format="heading-two" level={2} />
        <HeadingButton format="heading-three" level={3} />
        <MarkButton format="bold" icon={MdFormatBold} label={'Bold Text'} />
        <MarkButton
          format="italic"
          icon={MdFormatItalic}
          label={'Italicize text'}
        />
        <MarkButton
          format="underline"
          icon={MdFormatUnderlined}
          label={'underline text'}
        />
        <MarkButton format="code" icon={MdCode} label={'Change text to code'} />

        <LinkComponent />
      </HStack>

      <HStack px={2}>
        <BlockButton
          format="numbered-list"
          icon={MdFormatListNumbered}
          label={'format list numbered'}
        />
        <BlockButton
          format="bulleted-list"
          icon={MdFormatListBulleted}
          label={'format list bulleted'}
        />
        <BlockButton
          format="left"
          icon={MdFormatAlignLeft}
          label={'format align left'}
        />
        <BlockButton
          format="center"
          icon={MdFormatAlignCenter}
          label={'format align center'}
        />
        <BlockButton
          format="right"
          icon={MdFormatAlignRight}
          label={'format align right'}
        />
        <BlockButton
          format="justify"
          icon={MdFormatAlignJustify}
          label={'format align justify'}
        />
        <ImageComponent />
      </HStack>
    </Stack>
  );
};

export default ToolBar;
