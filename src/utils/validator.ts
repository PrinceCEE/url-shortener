export const urlValidator = (url: string) => {
  return /^(https?:\/\/)?((([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,6})|localhost|(\d{1,3}\.){3}\d{1,3})(:\d{1,5})?(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;%=]*)?$/.test(
    url
  );
};
