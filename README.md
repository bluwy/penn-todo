# PENN Todo

[![Build Status](https://travis-ci.org/BjornLuG/penn-todo.svg?branch=master)](https://travis-ci.org/BjornLuG/penn-todo)

A todo app built on the PENN stack ([PostgreSQL](https://www.postgresql.org), [Express](https://expressjs.com/), [Nuxt](https://nuxtjs.org), [Node.js](https://nodejs.org)).

## Table of contents
* [Architecture](#architecture)
* [Development state](#development-state)
* [Installation](#installation)
  * [Project setup](#project-setup)
  * [Database setup](#database-setup)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [FAQ](#faq)
* [License](#license)

## Architecture

The todo app is a Nuxt-Express hybrid scaffolded with [create-nuxt-app](https://github.com/nuxt/create-nuxt-app) with Express for backend and Jest for unit testing. It is currently only built on a Windows machine, so Linux and MacOS are untested.

Express acts as the server middleware for Nuxt, so Nuxt will redirect api calls for Express to handle.

Express does CRUD operations on a PostgreSQL database. Authentication is needed to do so, and is based on JSON Web Token (JWT).

Jest is used for unit testing, **all** tests are located in `__todos__` folder.

## Development state

The project is 90% done, only needs perfecting. Everything works, including todos database, user auth database, Express REST API, frontend interaction, etc... Currently, fake emails can be used for demos, but it still needs verification, which is sended as a link to [Ethereal](https://ethereal.email/).

## Installation

Dependencies not included in repo:
* [npm](https://www.npmjs.com) for managing packages.
* [PostgreSQL](https://www.postgresql.org) for testing local database.

Make sure to have them installed.

### Project setup

After cloning the repo, install the required dependencies:

``` bash
# Install dependencies
$ npm run install
```

The project uses [dotenv](https://github.com/motdotla/dotenv) to inject environment variables, a `.env` file is required before developing. Create one and place it in the root folder:
``` ini
; Prod/dev database url, e.g. postgres://john:12345678@localhost:5432/tododb
DATABASE_URL=

; Testing database url, e.g. postgres://john:12345678@localhost:5432/todotestdb
DATABASE_URL_TEST=

; Backend api url,  used by Nuxt for Axios' `baseUrl`. You can leave the value below as is.
API_URL_BROWSER=http://localhost:3000/api

; Secret string used for JWT hashing
JWT_SECRET=
```

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

### Database setup

The project uses two tables, `users` and `todos`.

Table `users`:

|    Column    |           Type           | Collation | Nullable |              Default              |
|--------------|--------------------------|-----------|----------|-----------------------------------|
| id           | integer                  |           | not null | nextval('users_id_seq'::regclass) |
| name         | text                     |           | not null |                                   |
| email        | text                     |           | not null |                                   |
| hash         | text                     |           | not null |                                   |
| verified     | boolean                  |           | not null | false                             |
| pwd_reset_ts | timestamp with time zone |           | not null | now()                             |

| Extra         | Values                                                                           |
|---------------|----------------------------------------------------------------------------------|
| Indexes       | "users_pkey" PRIMARY KEY, btree (id)                                             |
| Referenced by | TABLE "todos" CONSTRAINT "fk_user_id" FOREIGN KEY (user_id) REFERENCES users(id) |

Table `todos`:

| Column  |  Type   | Collation | Nullable |              Default              |
|---------|---------|-----------|----------|-----------------------------------|
| id      | integer |           | not null | nextval('todos_id_seq'::regclass) |
| title   | text    |           | not null |                                   |
| done    | boolean |           | not null |                                   |
| user_id | integer |           | not null |                                   |

| Extra                   | Values                                                  |
|-------------------------|---------------------------------------------------------|
| Indexes                 | "todos_pkey" PRIMARY KEY, btree (id)                    |
| Foreign-key constraints | "fk_user_id" FOREIGN KEY (user_id) REFERENCES users(id) |

The database is created with pgAdmin 4, but can be created manually as follows:

> Note: The commands below are retreived with `pg_dump`, so it was altered to work properly

Table `users`:

``` sql
CREATE TABLE public.users
(
    id serial PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    hash text NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    pwd_reset_ts timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
```

Table `todos`:

``` sql
CREATE TABLE public.todos
(
    id serial PRIMARY KEY,
    title text NOT NULL,
    done boolean NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT todos_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
```

## Roadmap

:heavy_check_mark: Done 
* Redesign interface 
* Clear done todos
* Email authentication

:blue_book: Todo
* Real email authentication (Currently using Ethereal)
* Refactor components
* Refactor CSS
* Refactor tests
* Settings menu
  * Edit profile
  * Manage auth
* Integrate payment system

:x: Cancelled
* Dockerize project (So much hassle for Windows 10 Home)
* Grouping todos
* Arrangable todos
* Online and offline mode

## Contributing
Feel free to send a pull request for new features or fix. Open an issue for any issues or feature requests. Feedback is much appreciated.

## FAQ

<details>
  <summary>What is PENN stack?</summary>
  The PENN stack is similar to the MEAN and MERN stacks. The only difference is that it uses PostgreSQL instead of MongoDB, and Nuxt (Vue) instead of React or Angular. It's an open-source stack too.
</details>

<details>
  <summary>Is this todo app any special than the others?</summary>
  Currently, no. It's just a simple todo app with only a custom design. It's only meant for me to learn backend, simple CRUD and auth, so it's not much of a production-ready app. A code review would be nice :)
</details>

## License

MIT
