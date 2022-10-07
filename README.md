# SlateEditorSM

Slate editor submodule

## About this module

This is a submodule code intended to be published as a package some day. It is a rich text editor built using **Typescript** with [Chakra Ui](https://chakra-ui.com), [NextJs](https://nextjs.org/) and [Slate](https://docs.slatejs.org/)

![Rich text Editor](https://res.cloudinary.com/mshindi-creations/image/upload/v1665126479/action-images/slateeditor_xokrpk.png)

## Getting started

### 1. Add to your working directory

```sh
git submodule add https://github.com/MshindiCreationsInc/SlateEditorSM.git
```

### 2. UI Dependencies

```sh
 yarn add react react-dom react-icons  @chakra-ui/react @emotion/css  @emotion/react framer-motion @emotion/styled
```

### 3. Editor dependencies

```sh
 yarn add escape-html  image-extensions is-hotkey is-url next slate slate-history slate-hyperscript slate-react
```

### 4. TS Development Dependencies

```sh
yarn add @types/escape-html @types/is-hotkey  @types/is-url @types/node @types/react @types/react-dom eslint  eslint-config-next typescript -D

```

### 5. Use

```sh
import SlateEditor from "./SlateEditorSM" // path relative to your cwd
```
