import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: ["dist", "node_modules", "*.log", ".vscode", "coverage"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./prisma/tsconfig.json"],
      },
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...prettier.rules,
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts"],
        },
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },
];
