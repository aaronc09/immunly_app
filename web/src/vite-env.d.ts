/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public URL of the ImmunoBot Cloudflare Worker (see web/worker/README.md). */
  readonly VITE_IMMUNOBOT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
