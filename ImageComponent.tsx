import { Box, Icon, IconButton, Image } from "@chakra-ui/react";
import { CustomEditor, ImageElement } from "./CustomTypes";
import React, { MouseEvent } from "react";
import {
  ReactEditor,
  useFocused,
  useSelected,
  useSlateStatic,
} from "slate-react";

import { BsImageFill } from "react-icons/bs";
import { ImageExtensions } from "./ImageExtensions";
import { MdDelete } from "react-icons/md";
import { Transforms } from "slate";
import UrlInputPopOver from "./UrlInputPopOver";
import isUrl from "is-url";

export const insertImage = (editor: CustomEditor, url: string) => {
  const text = { text: "" };
  const image: ImageElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

export const isImageUrl = (url: string) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop() || "";
  return ImageExtensions.includes(ext);
};

export const SlateImage: React.FC<{
  element: ImageElement;
  attributes: any;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  readOnly?: boolean;
}> = ({ attributes, children, element, align, readOnly }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const [isHover, setIsHover] = React.useState(false);

  const selected = useSelected();
  const focused = useFocused();

  return (
    <Box
      {...attributes}
      pb={4}
    >
      {children}
      <Box
        as={"div"}
        display={"flex"}
        justifyContent={
          align === "center"
            ? "center"
            : align === "right"
            ? "flex-end"
            : "flex-start"
        }
        contentEditable={false}
        position={"relative"}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => setIsHover(false)}
      >
        <Image
          src={element.url}
          display={"block"}
          maxH={"20em"}
          maxW={"100%"}
          alt="image"
          boxShadow={isHover && !readOnly ? "0 0 0 2px #B4D5FF" : "none"}
        />
        <Box
          position={"absolute"}
          top={0.5}
          left={0.5}
          display={isHover && !readOnly ? "block" : "none"}
        >
          <IconButton
            aria-label={"Delete image"}
            size={"xs"}
            icon={<Icon as={MdDelete} />}
            onClick={() => Transforms.removeNodes(editor, { at: path })}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ImageComponent = () => {
  const editor = useSlateStatic();

  const handleAddImage = (
    event: MouseEvent<HTMLButtonElement>,
    url: string
  ) => {
    event.preventDefault();

    if (!url) return;
    insertImage(editor, url);
  };

  return (
    <UrlInputPopOver
      inputPlaceHolder="https://example.com/image.png"
      onLinkAdd={handleAddImage}
      errorMessage="Invalid image URL"
      validatorFn={isImageUrl}
      icon={BsImageFill}
    />
  );
};

export default ImageComponent;
