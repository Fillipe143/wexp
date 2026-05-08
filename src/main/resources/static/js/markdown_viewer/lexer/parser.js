import { TokenKind } from "../token.js";

export function parseTokens(tokens) {
  return tokens.map((token) => parseToken(token)).join("\n");
}

function parseToken(token) {
  switch (token.kind) {
    case TokenKind.NL:
      return "<br />";

    case TokenKind.EOF:
      return "";

    case TokenKind.HLINE:
      return "<hr>";

    case TokenKind.TEXT:
      return token.content.trim();

    case TokenKind.LINK:
      return `<a href="${token.url}" target="_blank">${token.content}</a>`;

    case TokenKind.IMG:
      return `<img src="${token.url}" alt="${token.content}">`;

    case TokenKind.HEADER:
      return `<h${token.weight}>${parseTokens(token.content)}</h${token.weight}>`;

    case TokenKind.ITALIC:
      return `<em>${parseTokens(token.content)}</em>`;

    case TokenKind.BOLD:
      return `<strong>${parseTokens(token.content)}</strong>`;

    case TokenKind.CODE:
      return `<code>${token.content}</code>`;

    case TokenKind.LIST_ITEM:
      return `<ul><li>${token.content}</li></ul>`;

    default:
      return "";
  }
}
