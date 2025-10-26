const config = {
  plugins: ["@ianvs/prettier-plugin-sort-imports"], // <<< NEW PLUGIN
  importOrder: [
    // Use the special word for Third-Party/External modules, as it's reliable
    "<THIRD_PARTY_MODULES>",

    // Separation
    "",

    // 2. Global/Alias Imports (e.g., imports starting with @/)
    "^@/",

    // Separation
    "",

    // 3. Relative Imports (./ and ../)
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // <<< IMPORTANT FOR TYPESCRIPT IMPORTS (like `import type { ... }`)
  importOrderTypeScriptVersion: "5.0.0", // Use your actual TS version or a recent one
};

export default config;
