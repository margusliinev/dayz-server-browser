# DayZ Server Browser API

This project provides an API and a UI for browsing DayZ servers.

## Architecture Overview

The system consists of several components working together:

- **Background Crons:**
    - Scheduled background jobs (crons) continuously discover DayZ servers and update their basic information in the database.
    - This process is subject to rate limits, so it may take some time for new or updated server data to appear.

- **API:**
    - The API serves requests from the frontend UI and other clients.
    - Most API endpoints simply query the database for server information collected by the background crons.
    - There is a special endpoint that allows users to request a refresh of the player count for a specific server. This operation is not heavily rate limited and provides near real-time player numbers.

- **Frontend UI:**
    - The UI interacts with the API to display server data and allows users to trigger player count refreshes as needed.

This architecture ensures that server discovery and updates are efficient and respect external rate limits, while still providing up-to-date player counts on demand.

## Prerequisites

- [Node.js](https://nodejs.org/) (v24+ required)
- [Docker](https://www.docker.com/) (for MySQL databases)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/margusliinev/dayz-server-browser.git
cd dayz-server-browser
```

### 2. Create environment variable files

In the project root, create two files:

1. **.env** (for development):

    ```env
    PORT='3000'
    NODE_ENV='development'
    DATABASE_URL='mysql://user:password@localhost:3306/db'
    ```

2. **.env.test** (for running tests):
    ```env
    PORT='4000'
    NODE_ENV='test'
    DATABASE_URL='mysql://user:password@localhost:3307/db_test'
    ```

### 3. Start MySQL databases with Docker

Start two MySQL databases using Docker Compose:

- One for local development
- One for running tests

```sh
docker-compose up -d
```

### 4. Install dependencies for API & UI

```sh
cd ui && npm i && cd .. && npm i
```

### 5. Start the API and UI in development mode

```sh
npm run dev && cd ui && npm run dev
```

## Running Tests

```sh
npm run test
```

## Formatting Code

```sh
npm run format
```

---

For more details, see the scripts in `package.json` and the `docker-compose.yml` file.
