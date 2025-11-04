// FIX: The reference to "vite/client" was causing a file not found error.
// This has been removed and replaced with a declaration for `process` to support
// API key handling as per the Gemini API guidelines, resolving TypeScript errors.
declare var process: {
  env: {
    API_KEY: string;
  };
};
