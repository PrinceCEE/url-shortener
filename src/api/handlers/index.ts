import { Request, Response } from "express";
import { IResponse, StatisticsData } from "src/types";
import { encoder, decoder, store, urlValidator } from "src/utils";

const encodeHandler = (req: Request, res: Response) => {
  const { url } = req.body;
  const response: IResponse<{ short_url: string }> = {};

  if (!url || !urlValidator(url)) {
    response.success = false;
    response.message = "invalid url";
    res.status(400).json(response);
    return;
  }

  const urlData = store.getUrlData(url);
  if (urlData) {
    urlData.count++;
    response.success = true;
    response.message = "encoded url successfully";
    response.data = {
      short_url: `${process.env.REDIRECT_URL}/${urlData.key}`,
    };
    res.status(200).json(response);
    return;
  }

  const hash = encoder(url);
  const key = store.getKeyFromHash(hash);
  store.set(key, url);
  response.success = true;
  response.message = "encoded url successfully";
  response.data = {
    short_url: `${process.env.REDIRECT_URL}/${key}`,
  };
  res.status(200).json(response);
};

const decodeHandler = (req: Request, res: Response) => {
  const { short_url } = req.body;
  const response: IResponse<{ url: string }> = {};
  if (
    !short_url ||
    !urlValidator(short_url) ||
    !String(short_url).includes(process.env.REDIRECT_URL as string)
  ) {
    response.success = false;
    response.message = "invalid url";
    res.status(400).json(response);
    return;
  }
  const key = String(short_url).split("/").pop();
  if (!key) {
    response.success = false;
    response.message = "invalid url";
    res.status(400).json(response);
    return;
  }
  const data = decoder(key);
  if (!data) {
    response.success = false;
    response.message = "invalid url";
    res.status(404).json(response);
    return;
  }
  response.success = true;
  response.message = "url decoded successfully";
  response.data = { url: data.url };
  res.status(200).json(response);
};

const getStatisticsHandler = (req: Request, res: Response) => {
  const key = req.params.url_path;
  const response: IResponse<StatisticsData> = {};
  const data = decoder(key);
  if (!data) {
    response.success = false;
    response.message = "url not found";
    res.status(404).json(response);
    return;
  }
  response.success = true;
  response.message = "url statistics fetched successfully";
  response.data = {
    original_url: data.url,
    encoded_url: `${process.env.REDIRECT_URL}/${data.key}`,
    encoding_count: data.count,
    last_accessed: new Date().toString(), // mock
    status: "ACTIVE",
  };
  res.status(200).json(response);
};

export default { encodeHandler, decodeHandler, getStatisticsHandler };
