// src/ui/ui.css
var ui_default = "@import url(\"https://unpkg.com/tailwindcss@3.4.15/src/css/preflight.css\");\n\n:root {\n  --color-background-dark: #0e0e11;\n  --color-background-light: #ffffff;\n  --color-primary-dark: #6772e5;\n  --color-primary-light: #6772e5;\n  --border-radius: 0;\n\n  --color-background: var(--color-background-dark);\n  --color-primary: var(--color-primary-dark);\n\n  @media (prefers-color-scheme: light) {\n    --color-background: var(--color-background-light);\n    --color-primary: var(--color-primary-light);\n  }\n\n  --color-high: oklch(\n    from var(--color-background) calc(round(1 - round(l / 1.4))) 0 0\n  );\n  --color-low: oklch(from var(--color-background) calc(round(l / 1.4)) 0 0);\n  --lightness-high: color-mix(\n    in oklch,\n    var(--color-high) 0%,\n    oklch(var(--color-high) 0 0)\n  );\n  --lightness-low: color-mix(\n    in oklch,\n    var(--color-low) 0%,\n    oklch(var(--color-low) 0 0)\n  );\n  --font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\",\n    \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  --font-scale: 1;\n\n  --font-size-xs: calc(0.75rem * var(--font-scale));\n  --font-size-sm: calc(0.875rem * var(--font-scale));\n  --font-size-md: calc(1rem * var(--font-scale));\n  --font-size-lg: calc(1.125rem * var(--font-scale));\n  --font-size-xl: calc(1.25rem * var(--font-scale));\n  --font-size-2xl: calc(1.5rem * var(--font-scale));\n}\n\n[data-component=\"root\"] {\n  font-family: var(--font-family);\n  background-color: var(--color-background);\n  padding: 1rem;\n  color: white;\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  user-select: none;\n  color: var(--color-high);\n}\n\n[data-component=\"center\"] {\n  width: 380px;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n\n  &[data-size=\"small\"] {\n    width: 300px;\n  }\n}\n\n[data-component=\"link\"] {\n  text-decoration: underline;\n  font-weight: 600;\n}\n\n[data-component=\"label\"] {\n  display: flex;\n  gap: 0.75rem;\n  flex-direction: column;\n  font-size: var(--font-size-xs);\n}\n\n[data-component=\"logo\"] {\n  margin: 0 auto;\n  height: 2.5rem;\n  width: auto;\n  display: none;\n\n  @media (prefers-color-scheme: light) {\n    &[data-mode=\"light\"] {\n      display: block;\n    }\n  }\n\n  @media (prefers-color-scheme: dark) {\n    &[data-mode=\"dark\"] {\n      display: block;\n    }\n  }\n}\n\n[data-component=\"input\"] {\n  width: 100%;\n  height: 2.5rem;\n  padding: 0 1rem;\n  border: 1px solid transparent;\n  --background: oklch(\n    from var(--color-background) calc(l + (-0.06 * round(l / 1.4) + 0.03)) c h\n  );\n  background: var(--background);\n  border-color: oklch(\n    from var(--color-background)\n      calc(clamp(0.22, l + (-0.12 * round(l / 1.4) + 0.06), 0.88)) c h\n  );\n  border-radius: calc(var(--border-radius) * 0.25rem);\n  font-size: var(--font-size-sm);\n  outline: none;\n\n  &:focus {\n    border-color: oklch(\n      from var(--color-background)\n        calc(clamp(0.3, l + (-0.2 * round(l / 1.4) + 0.1), 0.7)) c h\n    );\n  }\n\n  &:user-invalid:not(:focus) {\n    border-color: oklch(0.4 0.09 7.91);\n  }\n}\n\n[data-component=\"button\"] {\n  height: 2.5rem;\n  cursor: pointer;\n  border: 0;\n  font-weight: 500;\n  font-size: var(--font-size-sm);\n  border-radius: calc(var(--border-radius) * 0.25rem);\n  display: flex;\n  gap: 0.75rem;\n  align-items: center;\n  justify-content: center;\n  background: var(--color-primary);\n  color: oklch(from var(--color-primary) calc(round(1 - round(l / 1.4))) 0 0);\n\n  &[data-color=\"ghost\"] {\n    background: transparent;\n    color: var(--color-high);\n    border: 1px solid\n      oklch(\n        from var(--color-background)\n          calc(clamp(0.22, l + (-0.12 * round(l / 1.4) + 0.06), 0.88)) c h\n      );\n  }\n\n  [data-slot=\"icon\"] {\n    width: 16px;\n    height: 16px;\n\n    svg {\n      width: 100%;\n      height: 100%;\n    }\n  }\n}\n\n[data-component=\"form\"] {\n  max-width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  margin: 0;\n}\n\n[data-component=\"form-alert\"] {\n  height: 2.5rem;\n  display: flex;\n  align-items: center;\n  padding: 0 1rem;\n  border-radius: calc(var(--border-radius) * 0.25rem);\n  background: oklch(0.28 0.06 7.91);\n  color: oklch(0.78 0.16 22.29);\n  text-align: left;\n  font-size: 0.75rem;\n  gap: 0.5rem;\n\n  &[data-color=\"success\"] {\n    background: oklch(0.28 0.06 149.45);\n    color: oklch(0.78 0.16 162.29);\n  }\n\n  &:has([data-slot=\"message\"]:empty) {\n    display: none;\n  }\n\n  [data-slot=\"icon\"] {\n    width: 1rem;\n    height: 1rem;\n  }\n}\n\n[data-component=\"form-footer\"] {\n  display: flex;\n  gap: 1rem;\n  font-size: 0.75rem;\n  align-items: center;\n  justify-content: center;\n\n  &:has(> :nth-child(2)) {\n    justify-content: space-between;\n  }\n}\n";

// src/ui/theme.ts
function getTheme() {
  return globalThis.OPENAUTH_THEME || THEME_SST;
}
var THEME_SST = {
  title: "SST",
  logo: {
    dark: "https://sst.dev/favicon.svg",
    light: "https://sst.dev/favicon.svg"
  },
  background: {
    dark: "#1a1a2d",
    light: "rgb(255, 255, 255)"
  },
  primary: "#f3663f",
  font: {
    family: "Rubik, sans-serif"
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@100;200;300;400;500;600;700;800;900&display=swap');
  `
};

// src/ui/base.tsx
function Layout(props) {
  const theme2 = getTheme();
  function get(key, mode) {
    if (!theme2)
      return;
    if (!theme2[key])
      return;
    if (typeof theme2[key] === "string")
      return theme2[key];
    return theme2[key][mode];
  }
  const radius = (() => {
    if (theme2?.radius === "none")
      return "0";
    if (theme2?.radius === "sm")
      return "1";
    if (theme2?.radius === "md")
      return "1.25";
    if (theme2?.radius === "lg")
      return "1.5";
    if (theme2?.radius === "full")
      return "1000000000001";
    return "1";
  })();
  return jsxDEV("html", {
    style: {
      "--color-background-light": get("background", "light"),
      "--color-background-dark": get("background", "dark"),
      "--color-primary-light": get("primary", "light"),
      "--color-primary-dark": get("primary", "dark"),
      "--font-family": theme2?.font?.family,
      "--font-scale": theme2?.font?.scale,
      "--border-radius": radius
    },
    children: [
      jsxDEV("head", {
        children: [
          jsxDEV("title", {
            children: theme2?.title || "OpenAuthJS"
          }, undefined, false, undefined, this),
          jsxDEV("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }, undefined, false, undefined, this),
          jsxDEV("link", {
            rel: "icon",
            href: theme2?.favicon
          }, undefined, false, undefined, this),
          jsxDEV("style", {
            dangerouslySetInnerHTML: { __html: ui_default }
          }, undefined, false, undefined, this),
          theme2?.css && jsxDEV("style", {
            dangerouslySetInnerHTML: { __html: theme2.css }
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV("body", {
        children: jsxDEV("div", {
          "data-component": "root",
          children: jsxDEV("div", {
            "data-component": "center",
            "data-size": props.size,
            children: [
              jsxDEV("img", {
                "data-component": "logo",
                src: get("logo", "light"),
                "data-mode": "light"
              }, undefined, false, undefined, this),
              jsxDEV("img", {
                "data-component": "logo",
                src: get("logo", "dark"),
                "data-mode": "dark"
              }, undefined, false, undefined, this),
              props.children
            ]
          }, undefined, true, undefined, this)
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
import {
jsxDEV
} from "hono/jsx/jsx-dev-runtime";
export {
  Layout
};
