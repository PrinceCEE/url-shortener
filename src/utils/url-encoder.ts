import { createHash } from "crypto";
import dataStore from "./store";

export const encoder = (longUrl: string) => {
  const hash = createHash("md5");
  hash.update(longUrl);
  return hash.digest("hex");
};

export const decoder = (key: string) => {
  return dataStore.get(key);
};
