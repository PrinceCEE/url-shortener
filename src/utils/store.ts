import { EncryptedUrlData } from "src/types";

const Store = new Map<string, EncryptedUrlData>();

const getStore = () => Store;

/**
 *
 * @param key The generated short id for the long url
 * @param value The long url
 */
const set = (key: string, value: string) => {
  Store.set(key, {
    key,
    url: value,
    count: 1,
  });
};

const get = (key: string) => Store.get(key);

const del = (key: string) => {
  Store.delete(key);
};

const getUrlData = (url: string) => {
  const urls = [...Store.values()];
  return urls.find((d) => d.url === url);
};

const getKeyFromHash = (
  hash: string,
  start = 0,
  end = Number(process.env.KEY_LEN) - 1
): string => {
  const key = hash.slice(start, end);
  const data = get(key);
  if (data) {
    return getKeyFromHash(hash, start + 1, end + 1);
  }

  return key;
};

export default {
  set,
  get,
  del,
  getStore,
  getUrlData,
  getKeyFromHash,
};
