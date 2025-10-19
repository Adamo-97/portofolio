module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    // Disable some rules that might cause issues
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
  ignorePatterns: [
    // Ignore all markdown files to prevent MD linting warnings
    "**/*.md",
    "**/*.mdx",
    // Other common ignores
    ".next",
    "node_modules",
    "out",
    "build",
    "coverage",
  ],
};
