import { Text } from "slate"
import escapeHtml from "escape-html"

const serialize = (node: any) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)

    //@ts-ignore
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }

    //@ts-ignore
    if (node.italic) {
      string = `<em>${string}</em>`
    }

    //@ts-ignore
    if (node.underline) {
      string = `<u>${string}</u>`
    }

    //@ts-ignore
    if (node.code) {
      string = `<code>${string}</code>`
    }

    return string
  }

  const children = node.children.map((n: any) => serialize(n)).join("")

  const align = node.align ? `align="${node.align}"` : ""

  switch (node.type) {
    case "paragraph":
      return `<p ${align}>${children}</p>`
    case "block-quote":
      return `<blockquote ${align}>${children}</blockquote>`
    case "bulleted-list":
      return `<ul ${align}>${children}</ul>`
    case "heading-one":
      return `<h1 ${align}>${children}</h1>`
    case "heading-two":
      return `<h2 ${align}>${children}</h2>`
    case "heading-three":
      return `<h3 ${align}>${children}</h3>`
    case "list-item":
      return `<li ${align}>${children}</li>`
    case "numbered-list":
      return `<ol ${align}>${children}</ol>`
    case "link":
      return `<a ${align} target="_blank"   href="${escapeHtml(
        node.url
      )}">${children}</a>`
    case "image":
      if (node.align) {
        return `<div style="text-align: ${node.align}; padding: 4px">
        <img 
        style="max-height:20em; max-width:90%; border-radius: 4px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;"
        src="${escapeHtml(node.url)}" alt="${escapeHtml(
          node.alt || "image"
        )}" />
        </div>`
      } else {
        return `<img style="max-height:20em; max-width:90%; border-radius: 4px; box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;" src="${escapeHtml(
          node.url
        )}" alt="${escapeHtml(node.alt || "image")}" />`
      }
    default:
      return children
  }
}

export default serialize
