/// <reference types="vite/client" />

// Fix: Add a declaration for `process` to allow using `process.env.API_KEY`
// as required by the coding guidelines, without causing a TypeScript error.
declare var process: {
  env: {
    API_KEY: string;
  };
};
