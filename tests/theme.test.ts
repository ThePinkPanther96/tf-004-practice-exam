import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

function initialize(
  saved: string | null,
  systemDark: boolean,
  storageBlocked = false,
) {
  const root = {
    dataset: {} as Record<string, string>,
    style: {} as Record<string, string>,
  };
  let meta = "";
  runInNewContext(readFileSync("public/theme.js", "utf8"), {
    localStorage: {
      getItem() {
        if (storageBlocked) throw new Error("Blocked");
        return saved;
      },
    },
    window: { matchMedia: () => ({ matches: systemDark }) },
    document: {
      documentElement: root,
      querySelector: () => ({
        setAttribute: (_name: string, value: string) => {
          meta = value;
        },
      }),
    },
  });
  return { theme: root.dataset.theme, scheme: root.style.colorScheme, meta };
}

test("saved theme takes priority over the system before the page paints", () => {
  assert.deepEqual(initialize("dark", false), {
    theme: "dark",
    scheme: "dark",
    meta: "#101827",
  });
  assert.deepEqual(initialize("light", true), {
    theme: "light",
    scheme: "light",
    meta: "#f6f7fb",
  });
});
test("first visit, invalid preferences, and blocked storage fall back to the system", () => {
  assert.equal(initialize(null, true).theme, "dark");
  assert.equal(initialize("invalid", false).theme, "light");
  assert.equal(initialize(null, true, true).theme, "dark");
});
test("main text, actions, and semantic status colors remain readable in both themes", () => {
  const source = readFileSync("src/theme.css", "utf8");
  const rules = [
    ...source.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)\}/g),
  ];
  const colors: Record<string, string> = {};
  const luminance = (hex: string) => {
    const [r, g, b] = hex
      .slice(1)
      .match(/../g)!
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  };
  assert.equal(rules.length, 2);
  for (const [index, rule] of rules.entries()) {
    Object.assign(
      colors,
      Object.fromEntries(
        [...rule[1].matchAll(/--([\w-]+):\s*(#[a-f\d]{6});/gi)].map((m) => [
          m[1],
          m[2],
        ]),
      ),
    );
    for (const [fg, bg] of [
      ["text", "surface"],
      ["text-secondary", "surface"],
      ["text-muted", "surface"],
      ["on-primary", "primary"],
      ["primary-text", "primary-soft"],
      ["study", "study-soft"],
      ["study-nav", "study-nav-active"],
      ["sidebar-text", "study-nav-active"],
      ["exam", "exam-soft"],
      ["exam", "surface"],
      ["on-primary", "exam-action"],
      ["on-primary", "exam-action-hover"],
      ["exam-nav", "exam-nav-active"],
      ["progress", "progress-soft"],
      ["progress", "surface"],
      ["progress-nav", "progress-nav-active"],
      ["success", "success-soft"],
      ["success", "surface"],
      ["gold", "gold-soft"],
      ["gold", "surface"],
      ["on-primary", "gold-action"],
      ["on-primary", "gold-action-hover"],
      ["warning", "warning-soft"],
      ["danger", "danger-soft"],
      ["sidebar-text", "sidebar"],
      ["sidebar-muted", "sidebar"],
    ]) {
      const values = [luminance(colors[fg]), luminance(colors[bg])].sort(
        (a, b) => b - a,
      );
      assert.ok(
        (values[0] + 0.05) / (values[1] + 0.05) >= 4.5,
        `${index ? "dark" : "light"}: ${fg} on ${bg}`,
      );
    }
  }
});
