import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "public/vendor/**",
      "lib/home/vendor/**",
      "lib/home/portfolio.js",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
