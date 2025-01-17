## ShortLink

ShortLink is a URL shortening service.

## System Requirements

- NodeJs with minimum version of v20 (Please kindly use nvm to download NodeJs)

## Steps to run the server and tests

- Clone the repository using `git clone` command
- Run `npm install` after making sure that NodeJs >= v20 is already installed (npm comes with NodeJs installation)
- Create a `.env and .test.env ` file using `cp .example.env .env && cp .example.env .test.env`, then add the values of the keys in the files. You can use:
  - PORT=3000
  - REDIRECT_URL=http://localhost:3000
  - NODE_ENV=development (for .env) and test (for .test.env)
  - KEY_LEN=8
- Run `npm run dev` to run the server
- Run `npm test` to run the tests
