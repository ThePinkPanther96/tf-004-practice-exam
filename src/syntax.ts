import hcl from "@shikijs/langs/hcl";
import bash from "@shikijs/langs/bash";
import json from "@shikijs/langs/json";
import darkPlus from "@shikijs/themes/dark-plus";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Bundle only the grammars used by the question bank. No CDN, WASM download,
// eval, or network request is needed when displaying code during an exam.
const highlighter = createHighlighterCoreSync({
  themes: [darkPlus],
  langs: [hcl, bash, json],
  engine: createJavaScriptRegexEngine(),
});

export function highlightCode(code: string, language = "text") {
  const aliases: Record<string, string> = {
    terraform: "hcl",
    tf: "hcl",
    shell: "bash",
    sh: "bash",
    plaintext: "text",
  };
  const requested = aliases[language.toLowerCase()] ?? language.toLowerCase();
  const lang = ["hcl", "bash", "json"].includes(requested) ? requested : "text";
  return {
    language: lang,
    ...highlighter.codeToTokens(code, { lang, theme: "dark-plus" }),
  };
}
