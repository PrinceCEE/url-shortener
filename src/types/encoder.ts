export type EncodingTestConfig = {
  url: string;
  encodingKey: string;
};

export type EncryptedUrlData = {
  key: string;
  url: string;
  count: number; // number of times the url has been encrypted
};
