import test from "node:test";
import assert = require("node:assert");
import dataStore from "./store";

test("test data store", async (t) => {
  const url = "https://www.google.com";

  await t.test("returns empty store", (t) => {
    const store = dataStore.getStore();
    assert.notEqual(store, null);
    assert.equal(store.size, 0);
  });

  await t.test("adds item to store", (t) => {
    const store = dataStore.getStore();
    dataStore.set("google", url);

    assert.equal(store.has("google"), true);
    assert.equal(dataStore.get("google")?.url, url);
  });

  await t.test("get data using url", (t) => {
    const data = dataStore.getUrlData(url);
    assert.notEqual(data, null);
    assert.equal(data?.key, "google");
    assert.equal(data?.url, url);
  });

  await t.test("removes item from store", (t) => {
    const store = dataStore.getStore();

    dataStore.del("google");
    assert.equal(store.size, 0);
  });
});
