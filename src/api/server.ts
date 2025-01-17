import http from "http";
import express, { Request, Response, NextFunction } from "express";
import handlers from "./handlers";
import { IResponse } from "src/types";

const setupHandlers = () => {
  const app = express();

  app.use(express.json({ limit: "100kb" }));
  app.post("/encode", handlers.encodeHandler);
  app.post("/decode", handlers.decodeHandler);
  app.get("/statistic/:url_path", handlers.getStatisticsHandler);
  app.use((req: Request, res: Response, next: NextFunction) => {
    const response: IResponse<null> = {
      success: false,
      message: "not found",
    };
    res.status(404).json(response);
  });

  return app;
};

const getServer = () => {
  const app = setupHandlers();
  const server = http.createServer(app);
  return server;
};

export default getServer;
