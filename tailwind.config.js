/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    boxShadow: {
      'custom-inner': '0px -9px 6px -3px rgba(54,0,0,1) inset',
      'inner-userlist-shadow' : '0px 1px 14px 0px rgba(0,0,0,1) inset',
    },
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      secondary: {
        DEFAULT: "hsl(var(--secondary))",
        foreground: "hsl(var(--secondary-foreground))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
    },
  },
  screens: {
    "2xl": { max: "1535px" },
    "1xl": { max: "1366px" },
    xl: { max: "1279px" },
    lg: { max: "1023px" },
    md: { max: "767px" },
    sm: { max: "639px" },
    xsm: { max: "560px" },
    xxsm: { max: "430px" },
    xxxsm: { max: "390px" },
    xxxxsm: { max: "375px" },
  },
};
export const plugins = [];
