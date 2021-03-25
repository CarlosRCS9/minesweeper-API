# minesweeper-API

This project implements a REST API for a minesweeper game in Node.js.

# Client requirements (from most to least important)

- Develop a REST API for the game. :white_check_mark:
- [Document](https://documenter.getpostman.com/view/13441081/TzCHCWZE) the REST API of the game. :white_check_mark:
- Develop an [API client library](apps/python-client/example.py) for the REST API (ideally in another language than Node.js). :white_check_mark:
- When a cell with no adjacent mines is revealed, all adjacent squares will be revealed (and repeat). :white_check_mark:
- The game must allow to flag a cell with a question mark. :white_check_mark:
- The game must allow to flag a cell with a red flag. :white_check_mark:
- The game must detect when it is over. :white_check_mark:
- The REST API should provide the persistence of game data. :white_check_mark:
- The game time must be tracked. :white_check_mark:
- The games should be able to be saved and resumed. :white_check_mark:
- The player should be able to select game parameters (rows, columns, and mines). :white_check_mark:
- The REST API must support multiple users. :white_check_mark:

# Thinking process

All decisions made for this project are described in this [file](thinking-process.md).

# Resources

API documentation: https://documenter.getpostman.com/view/13441081/TzCHCWZE

API public URL: https://fvr10a1k21.execute-api.us-east-2.amazonaws.com/develop

Frontend public URL: https://ccastillo.ddnsking.com/games

# Installation

## Pre-requisistes

- Create an account in [serverless](https://app.serverless.com).
- Install and configure [serverless](https://www.serverless.com).
- Install [Node.js](https://nodejs.org) v12.

## Backend deployment

- Clone the repository
- Login with the [serverless](https://www.serverless.com) account.
  ```
  sls login
  ```
- Deploy the service.
  ```
  sls deploy
  ```
- Store the service url.

## Frontend deployment

- Change directory to the frontend app.
  ```
  cd apps/frontend
  ```
- Copy the _.env.example_.
  ```
  cp .env.example .env
  ```
- Modify the _.env_ to include the stored service url.
- Modify the _.env_ to match the public path of the web server.
- Install node packages.
  ```
  npm i
  ```
- Generate the static files.
  ```
  npm run build
  ```
- Serve the static files with NGINX/Apache.
