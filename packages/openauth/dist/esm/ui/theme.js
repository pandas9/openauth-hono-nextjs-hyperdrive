// src/ui/theme.ts
function setTheme(value) {
  globalThis.OPENAUTH_THEME = value;
}
function getTheme() {
  return globalThis.OPENAUTH_THEME || THEME_SST;
}
var THEME_TERMINAL = {
  title: "terminal",
  radius: "none",
  favicon: "https://www.terminal.shop/favicon.svg",
  logo: {
    dark: "https://www.terminal.shop/images/logo-white.svg",
    light: "https://www.terminal.shop/images/logo-black.svg"
  },
  primary: "#ff5e00",
  background: {
    dark: "rgb(0, 0, 0)",
    light: "rgb(255, 255, 255)"
  },
  font: {
    family: "Geist Mono, monospace"
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100;200;300;400;500;600;700;800;900&display=swap');
  `
};
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
var THEME_SUPABASE = {
  title: "Supabase",
  logo: {
    dark: "https://supabase.com/dashboard/_next/image?url=%2Fdashboard%2Fimg%2Fsupabase-dark.svg&w=128&q=75",
    light: "https://supabase.com/dashboard/_next/image?url=%2Fdashboard%2Fimg%2Fsupabase-light.svg&w=128&q=75"
  },
  background: {
    dark: "#171717",
    light: "#f8f8f8"
  },
  primary: {
    dark: "#006239",
    light: "#72e3ad"
  },
  font: {
    family: "Varela Round, sans-serif"
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Varela Round:wght@100;200;300;400;500;600;700;800;900&display=swap');
  `
};
var THEME_VERCEL = {
  title: "Vercel",
  logo: {
    dark: "https://vercel.com/mktng/_next/static/media/vercel-logotype-dark.e8c0a742.svg",
    light: "https://vercel.com/mktng/_next/static/media/vercel-logotype-light.700a8d26.svg"
  },
  background: {
    dark: "black",
    light: "white"
  },
  primary: {
    dark: "white",
    light: "black"
  },
  font: {
    family: "Geist, sans-serif"
  },
  css: `
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap');
  `
};
export {
  setTheme,
  getTheme,
  THEME_VERCEL,
  THEME_TERMINAL,
  THEME_SUPABASE,
  THEME_SST
};
