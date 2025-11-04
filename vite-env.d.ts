/// <reference types="vite/client" />

// Fix: Augment the NodeJS namespace to add the API_KEY property to the
// existing `process.env` type. This avoids redeclaring the `process` variable,
// which causes conflicts with global types from Node.js that are present in
// the project.
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
