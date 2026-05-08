import { tokenizer } from "./lexer/tokenizer.js";
import { parseTokens } from "./lexer/parser.js";

export function mdToHtml(source) {
  return parseTokens(tokenizer(source));
}
