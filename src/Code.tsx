import { Fragment, memo } from "react";
import { highlightCode } from "./syntax";

export const Code = memo(function Code({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const fenced =
    !!className?.startsWith("language-") || children.includes("\n");
  if (!fenced) return <code>{children}</code>;
  const source = children.replace(/\n$/, "");
  const highlighted = highlightCode(
    source,
    className?.replace(/^language-/, ""),
  );
  return (
    <code className={className} data-language={highlighted.language}>
      {highlighted.tokens.map((line, i) => (
        <Fragment key={i}>
          {line.map((token, j) => (
            <span
              key={j}
              style={{
                color: token.color,
                fontStyle: (token.fontStyle ?? 0) & 1 ? "italic" : undefined,
                fontWeight: (token.fontStyle ?? 0) & 2 ? "bold" : undefined,
                textDecoration:
                  (token.fontStyle ?? 0) & 4 ? "underline" : undefined,
              }}
            >
              {token.content}
            </span>
          ))}
          {i < highlighted.tokens.length - 1 ? "\n" : null}
        </Fragment>
      ))}
    </code>
  );
});
