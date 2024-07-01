import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    data: {
      open: "state='open'",
      closed: "state='closed'",
    },
    colors: {
      "accent-8": "var(--accent-8)",
      "accent-9": "var(--accent-9)",
      "accent-12": "var(--accent-12)",
      "accent-a1": "var(--accent-a1)",
      "accent-a2": "var(--accent-a2)",
      "accent-a3": "var(--accent-a3)",
      "accent-a4": "var(--accent-a4)",
      "accent-a5": "var(--accent-a5)",
    },
    fontSize: {
      2: "var(--font-size-2)",
      3: "var(--font-size-3)",
    },
    fontWeight: {
      regular: "var(--font-weight-regular)",
    },
    spacing: {
      0: "0px",
      px: "1px",
      2: "var(--space-2)",
      3: "var(--space-3)",
      5: "var(--space-5)",
      6: "var(--space-6)",
      lh: "1lh",
    },
    borderRadius: {
      3: "var(--radius-3)",
    },
    animation: {
      "accordion-slide-down": "accordion-slide-down 300ms ease-out",
      "accordion-slide-up": "accordion-slide-up 300ms ease-out",
    },
    keyframes: {
      "accordion-slide-down": {
        from: { height: "0" },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-slide-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: "0" },
      },
    },
  },
  plugins: [],
} satisfies Config;
