import {
  Button,
  Icon,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';

import FocusLock from 'react-focus-lock';
import isUrl from 'is-url';

const UrlInputPopOver: React.FC<{
  onLinkAdd: (event: MouseEvent<HTMLButtonElement>, url: string) => void;
  inputPlaceHolder: string;
  icon: any;
  isActive?: boolean;
  errorMessage: string;
  validatorFn?: (url: string) => boolean;
}> = ({
  isActive,
  icon,
  onLinkAdd,
  inputPlaceHolder,
  errorMessage,
  validatorFn,
}) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const inputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    if (url.trim().length < 1) {
      setError(errorMessage);
      return;
    }

    if (!isUrl(url)) {
      setError(errorMessage);
      return;
    }

    if (validatorFn && !validatorFn(url)) {
      setError(errorMessage);
      return;
    }

    onLinkAdd(event, url);
    onClose();
    setUrl('');
  };

  useEffect(() => {
    let timeOut: any = null;

    if (error) {
      timeOut = setTimeout(() => {
        setError('');
      }, 1500);
    }
    return () => timeOut && clearTimeout(timeOut);
  }, [error]);

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={inputRef}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom-start"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton
          variant={'ghost'}
          size={'sm'}
          aria-label="insert link"
          icon={<Icon as={icon} />}
          isActive={isActive}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverHeader border={'none'}>Insert Url</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody border={'none'}>
              <Stack>
                {error && error.length > 0 && (
                  <Text size={'sm'} fontWeight={600} variant={'attention'}>
                    {error}
                  </Text>
                )}
                <Input
                  placeholder={inputPlaceHolder}
                  ref={inputRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </Stack>
            </PopoverBody>
            <PopoverFooter
              border={'none'}
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Button
                variant={'secondary'}
                size={'sm'}
                px={8}
                onClick={onClose}
              >
                Dismiss
              </Button>
              <Button
                size={'sm'}
                variant={'done'}
                px={8}
                onMouseDown={handleSubmit}
                ml={3}
              >
                Add
              </Button>
            </PopoverFooter>
          </FocusLock>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default UrlInputPopOver;
