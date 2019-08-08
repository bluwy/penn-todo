# PENN Todo

> [WIP] **DO NOT** release to production.

[![Build Status](https://travis-ci.org/BjornLuG/penn-todo.svg?branch=master)](https://travis-ci.org/BjornLuG/penn-todo)

A todo app built on the PENN stack ([PostgreSQL](https://www.postgresql.org), [Express](https://expressjs.com/), [Nuxt](https://nuxtjs.org), [Node.js](https://nodejs.org)).

## Table of contents
* [Architecture](#architecture)
* [Development state](#development-state)
* [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [FAQ](#faq)
* [License](#license)

## Architecture

The todo app is a Nuxt-Express hybrid scaffolded with [create-nuxt-app](https://github.com/nuxt/create-nuxt-app) with Express for backend and Jest for unit testing. It is currently only built on a Windows machine, so Linux and MacOS are untested.

Express acts as the server middleware for Nuxt, so Nuxt will redirect api calls for Express to handle.

Express does CRUD operations on a PostgreSQL database. Auth is yet to be implemented, so currently todos are public to everyone. (Not ready for production)

Jest is used for unit testing, **all** tests are located in `__todos__` folder.

## Development state

Currently, the todo app is fully functional. It interacts with the backend and database well. Basic CRUD operations works. The only downside is that there's no limit to how many todos can be added. Spam bots galore! (Not ready for production)


## Installation

Dependencies not included in repo:
* [npm](https://www.npmjs.com) for managing packages.
* [PostgreSQL](https://www.postgresql.org) for testing local database.

Make sure to have them installed.

After cloning the repo, install the required dependencies:

``` bash
# Install dependencies
$ npm run install
```

The project uses [dotenv](https://github.com/motdotla/dotenv) to inject environment variables, a `.env` file is required before developing. Create one and place it in the root folder:
``` ini
DATABASE_URL=<protocol>://<name>:<password>@<host>:<port>/<dbname>
DATABASE_URL_TEST=<protocol>://<name>:<password>@<host>:<port>/<dbname>
API_URL_BROWSER=http://localhost:3000/api
```
> `DATABASE_URL` and `DATABASE_URL_TEST` should be replaced accordingly, e.g.
`postgres://john:12345678@localhost:5432/tododb` and `postgres://john:12345678@localhost:5432/todotestdb`

> `API_URL_BROWSER` is used by Nuxt for Axios' baseUrl, `/api` is where the server is hosted. You don't have to change this value unless needed.

To run dev server (This starts Nuxt and Express servers):
``` bash
# Serve with hot reload at localhost:3000
$ npm run dev
```

To lint files (Do either one):
``` bash
# Lint files with ESLint
$ npm run lint
# Lint and fix files with ESLint
$ npm run lintfix
```

To run tests:
``` bash
# Starts Jest unit testing
$ npm run test
```

To build for production and launch server:
``` bash
# Build for production and launch server
$ npm run build
$ npm run start
```
> Note: Server can only be started after build

## Roadmap

* Redesign interface
* Clear done todos
* Email authentication
* Dockerize project
* Grouping todos
* Arrangable todos
* Online and offline mode

## Contributing
Feel free to send a pull request for new features or fix. Open an issue for any issues or feature requests. Feedback is much appreciated.

## FAQ

<details>
  <summary>What is PENN stack?</summary>
  The PENN stack is similar to the MEAN and MERN stacks. The only difference is that it uses PostgreSQL instead of MongoDB, and Nuxt(Vue) instead of React or Angular. It's an open-source stack too.
</details>

<details>
  <summary>Is this todo app any special than the others?</summary>
  Currently, no. It's just a simple todo app with only a custom design. More features, such as authentication will be added too, so who knows it could be unique too :)
</details>

<details>
  <summary>Why not just make a simple todo app?</summary>
  Like any other todo app, this project is meant for me to learn backend, simple CRUD and auth. A code review would be nice.
</details>

## License

MIT
