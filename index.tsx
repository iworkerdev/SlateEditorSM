import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import { Editable, Slate, withReact } from "slate-react";
import { Element, Leaf } from "./EditorComponent";
import { Range, Transforms, createEditor } from "slate";
import React, { useCallback, useMemo } from "react";
import { insertImage, isImageUrl } from "./ImageComponent";

import { CustomEditor } from "./CustomTypes";
import ToolBar from "./ToolBar";
import deserialize from "./deserialize";
import { getTextFromHtml } from "../utils/fn";
import isHotkey from "is-hotkey";
import isUrl from "is-url";
import serialize from "./Serialize";
import { toggleMark } from "./EditorButton";
import { withHistory } from "slate-history";
import { wrapLink } from "./LinkComponent";

//generate a unique mongo id
export const MongoId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
      .toLowerCase()
  );
};

type HotKeys = {
  [key: string]: string;
};

const HOTKEYS: HotKeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const withInLines = (editor: CustomEditor) => {
  const { insertData, insertText, isInline } = editor;

  editor.isInline = (element) =>
    ["link", "button"].includes(element.type) || isInline(element);

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");

    if (text && isUrl(text)) {
      wrapLink(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data: any) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url as string);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const withHtml = (editor: CustomEditor) => {
  const { insertData, isVoid, isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const html = data.getData("text/html");

    if (html) {
      const parsed = new DOMParser().parseFromString(html, "text/html");
      const fragment = deserialize(parsed.body);
      Transforms.insertFragment(editor, fragment);
      return;
    }

    insertData(data);
  };
  return editor;
};

export interface SlateEditorContent {
  html: string;
  text: string;
}

const SlateEditor: React.FC<{
  onEditorChange: (html: string, text: string) => void;
  content: SlateEditorContent;
  editorId?: string;
  readOnly?: boolean;
}> = ({ onEditorChange, content, editorId = MongoId(), readOnly = false }) => {
  const renderElement = useCallback(
    (props: any) => (
      <Element
        readOnly={readOnly}
        {...props}
      />
    ),
    [readOnly]
  );
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const editor: CustomEditor = useMemo(
    () =>
      withHtml(withImages(withInLines(withReact(withHistory(createEditor()))))),
    []
  );

  const onKeyDown: React.KeyboardEventHandler = (event) => {
    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event as any)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(editor, mark);
      }
    }

    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;

      if (isHotkey("left", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: true });
        return;
      }

      if (isHotkey("right", nativeEvent)) {
        event.preventDefault();
        Transforms.move(editor, { unit: "offset", reverse: false });
        return;
      }
    }
  };
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const editorValue = deserialize(
    new DOMParser().parseFromString(content.html, "text/html").body
  );

  return (
    <Stack
      w={"100%"}
      minW={"480px"}
      spacing={0}
      boxShadow={"sm"}
      border={"1px"}
      borderColor={borderColor}
      borderRadius={"4px"}
      onMouseLeave={() => {
        const htmlValue = String(serialize(editor));
        const textValue = getTextFromHtml(htmlValue);
        onEditorChange(htmlValue, textValue);
      }}
    >
      <Slate
        editor={editor}
        value={editorValue}
      >
        {!readOnly && <ToolBar />}
        <Box
          p={3}
          bg={bgColor}
          border={"1px"}
          borderColor={borderColor}
          minH={40}
          borderBottomRadius={"4px"}
        >
          <Editable
            readOnly={readOnly}
            id={editorId}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Enter some rich text…"
            spellCheck
            autoFocus
            onKeyDown={onKeyDown}
          />
        </Box>
      </Slate>
    </Stack>
  );
};

export default SlateEditor;
