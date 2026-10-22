import { test } from "node:test";
import assert from "node:assert/strict";
import { highlightCode } from "../src/syntax.js";

test("Terraform uses VS Code Dark+ colors without changing the source text", () => {
  const code =
    '# Keep the original text\nresource "aws_instance" "example" {\n  count = 2\n  enabled = true\n}\n';
  const highlighted = highlightCode(code, "hcl");
  assert.equal(highlighted.language, "hcl");
  assert.equal(highlighted.bg, "#1E1E1E");
  assert.equal(
    highlighted.tokens
      .map((line) => line.map((token) => token.content).join(""))
      .join("\n"),
    code,
  );
  assert.ok(
    new Set(highlighted.tokens.flat().map((token) => token.color)).size >= 4,
  );
  assert.deepEqual(highlightCode(code, "terraform").tokens, highlighted.tokens);
});

test("unsupported languages safely preserve code as plain text", () => {
  const code = '<script>alert("literal source, not HTML")</script>';
  const highlighted = highlightCode(code, "unknown");
  assert.equal(highlighted.language, "text");
  assert.equal(
    highlighted.tokens
      .flat()
      .map((token) => token.content)
      .join(""),
    code,
  );
});
