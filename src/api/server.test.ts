require("module-alias/register");

import test from "node:test";
import dotenv from "dotenv";
import { join } from "path";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import assert from "assert";
import getServer from "./server";
import { IResponse, StatisticsData } from "src/types";

dotenv.config({
  path: join(process.cwd(), ".test.env"),
});

test("test server handlers", async (t) => {
  const server = getServer();
  const request = supertest(server);
  const urls: { original: string; short?: string }[] = [];
  for (let i = 0; i < 100; i++) {
    urls.push({ original: faker.internet.url() });
  }

  await t.test("encode url", async (t) => {
    await t.test("encode valid urls", async (t) => {
      for await (const url of urls) {
        const res = await request
          .post("/encode")
          .set("Content-Type", "application/json")
          .send({ url: url.original });

        const body: IResponse<{ short_url: string }> = res.body;
        assert.equal(res.statusCode, 200);
        assert.equal(body.success, true);
        assert.equal(body.message, "encoded url successfully");
        assert.notEqual(body.data?.short_url, null);
        assert.notEqual(body.data?.short_url, undefined);
        url.short = body.data?.short_url;
      }
    });

    await t.test("encode invalid url", async (t) => {
      const res = await request
        .post("/encode")
        .set("Content-Type", "application/json")
        .send({ url: "https://google" });

      const body: IResponse<null> = res.body;
      assert.equal(res.statusCode, 400);
      assert.equal(body.success, false);
      assert.equal(body.message, "invalid url");
    });
  });

  await t.test("get url statistics", async (t) => {
    const url = urls[0];
    for (let i = 0; i < 5; i++) {
      const res = await request
        .post("/encode")
        .set("Content-Type", "application/json")
        .send({ url: url.original });

      const body: IResponse<{ short_url: string }> = res.body;
      assert.equal(res.statusCode, 200);
      assert.equal(body.success, true);
      assert.equal(body.message, "encoded url successfully");
    }

    const urlPath = url.short?.split("/").pop();
    assert.notEqual(urlPath, null);
    assert.notEqual(urlPath, undefined);

    const res = await request.get(`/statistic/${urlPath}`);
    const body: IResponse<StatisticsData> = res.body;
    assert.equal(res.statusCode, 200);
    assert.equal(body.success, true);
    assert.equal(body.message, "url statistics fetched successfully");
    assert.equal(body.data?.encoding_count, 6);
    assert.equal(body.data?.status, "ACTIVE");
    assert.equal(
      body.data?.encoded_url,
      `${process.env.REDIRECT_URL}/${urlPath}`
    );
  });

  await t.test("decode url", async (t) => {
    await t.test("decode valid short url", async (t) => {
      const url = urls[0];
      const res = await request
        .post("/decode")
        .set("Content-Type", "application/json")
        .send({
          short_url: url.short,
        });

      const body: IResponse<{ url: string }> = res.body;
      assert.equal(res.statusCode, 200);
      assert.equal(body.success, true);
      assert.equal(body.message, "url decoded successfully");
      assert.equal(body.data?.url, url.original);
    });

    await t.test("decode invalid short url", async (t) => {
      const res = await request
        .post("/decode")
        .set("Content-Type", "application/json")
        .send({
          short_url: "https://bit.ly/ddu68scdd",
        });

      const body: IResponse<null> = res.body;
      assert.equal(res.statusCode, 400);
      assert.equal(body.success, false);
      assert.equal(body.message, "invalid url");
    });
  });

  server.close();
});
