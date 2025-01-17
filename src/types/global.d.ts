declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT?: string;
    REDIRECT_URL?: string;
    KEY_LEN?: string;
  }
}
