// FIX: The reference to "vite/client" was causing a file not found error.
// This has been removed and replaced with a declaration for `process` to support
// API key handling as per the Gemini API guidelines, resolving TypeScript errors.

// FIX: To resolve redeclaration errors, augment the global NodeJS.ProcessEnv
// interface instead of redeclaring the `process` variable. This makes TypeScript
// aware of `process.env.API_KEY` without causing type conflicts.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
