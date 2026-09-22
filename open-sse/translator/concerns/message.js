import { OPENAI_BLOCK } from "../schema/index.js";

// Collapse an OpenAI content-part array: text-only parts become a plain string,
// otherwise the array is returned as-is.
export function collapseTextParts(parts) {
  if (parts.length === 0) return "";
  if (parts.every((p) => p.type === OPENAI_BLOCK.TEXT)) {
    return parts.map((p) => p.text).join("\n");
  }
  return parts;
}
