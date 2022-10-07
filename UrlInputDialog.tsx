import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';

import isUrl from 'is-url';

const UrlInputDialog: React.FC<{
  handleAccept: (event: MouseEvent<HTMLButtonElement>, url: string) => void;
  children: (onOpen: () => void) => React.ReactNode;
  inputPlaceHolder: string;
  errorMessage: string;
  validatorFn?: (url: string) => boolean;
}> = ({
  handleAccept,
  children,
  inputPlaceHolder,
  errorMessage,
  validatorFn,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = useRef<HTMLButtonElement>(null);

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

    handleAccept(event, url);
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
    <>
      {children(onOpen)}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <Text size={'xl'}>Enter link URL</Text>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack>
                {error && error.length > 0 && (
                  <Text size={'sm'} fontWeight={600} variant={'attention'}>
                    {error}
                  </Text>
                )}
                <Input
                  placeholder={inputPlaceHolder}
                  autoFocus
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                />
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                variant={'secondary'}
                size={'sm'}
                px={8}
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size={'sm'}
                variant={'done'}
                px={8}
                onMouseDown={handleSubmit}
                onClick={onClose}
                ml={3}
              >
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default UrlInputDialog;
