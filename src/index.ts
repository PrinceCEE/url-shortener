require("module-alias/register");

import dotenv from "dotenv";
import getServer from "./api/server";

function main() {
  dotenv.config();

  const port = process.env.PORT || "3000";
  const server = getServer();
  server.listen(port, () => {
    console.log(`server running on :${port}`);
  });
}

main();
