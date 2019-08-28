# PENN Todo

[![Build Status](https://travis-ci.org/BjornLuG/penn-todo.svg?branch=master)](https://travis-ci.org/BjornLuG/penn-todo)

A todo app built on the PENN stack ([PostgreSQL](https://www.postgresql.org), [Express](https://expressjs.com/), [Nuxt](https://nuxtjs.org), [Node.js](https://nodejs.org)).

## Demo

A demo can be found at https://penn-todo.herokuapp.com. Currently, you can sign up a new account without a real email, since verification emails are being sent with [Ethereal](https://ethereal.email/). 

You can log in with a demo account too:
* Email: d@m.o
* Password: demo

Feel free to open an issue for any bugs and quirks :)

## Table of contents
* [Architecture](#architecture)
* [Development state](#development-state)
* [Installation](#installation)
  * [Project setup](#project-setup)
  * [Database setup](#database-setup)
* [Deployment](#deployment)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [FAQ](#faq)
* [License](#license)

## Architecture

The todo app is a Nuxt-Express hybrid scaffolded with [create-nuxt-app](https://github.com/nuxt/create-nuxt-app) with Express for backend and Jest for unit testing. It is currently only built on a Windows machine, so Linux and MacOS are untested.

Express acts as the server middleware for Nuxt, so Nuxt will redirect api calls for Express to handle.

Express does CRUD operations on a PostgreSQL database. Authentication is needed to do so, and is based on JSON Web Token (JWT).

Jest is used for unit testing, **all** tests are located in `__tests__` folder.

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

; Set 'true' without quotes to enable database SSL access, any other values will equal to false. (Default: false)
DATABASE_SSL=false

; Backend api url,  used by Nuxt for Axios' `baseUrl`. (Default: http://localhost:3000/api)
API_URL_BROWSER=http://localhost:3000/api

; Secret string used for JWT hashing
JWT_SECRET=
```

> Note: In the `.env` file, remove the comments as dotenv doesn't support it

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

| Column       | Type                     | Collation | Nullable | Default                           |
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

| Column  | Type    | Collation | Nullable | Default                           |
|---------|---------|-----------|----------|-----------------------------------|
| id      | integer |           | not null | nextval('todos_id_seq'::regclass) |
| title   | text    |           | not null |                                   |
| done    | boolean |           | not null |                                   |
| user_id | integer |           | not null |                                   |

| Extra                   | Values                                                  |
|-------------------------|---------------------------------------------------------|
| Indexes                 | "todos_pkey" PRIMARY KEY, btree (id)                    |
| Foreign-key constraints | "fk_user_id" FOREIGN KEY (user_id) REFERENCES users(id) |

The database is created with pgAdmin 4, but can be created manually with `psql` as follows:

Table `users`:

``` sql
CREATE TABLE public.users
(
    id serial PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    hash text NOT NULL,
    verified boolean NOT NULL DEFAULT false,
    pwd_reset_ts timestamptz NOT NULL DEFAULT now()
);
```

Table `todos`:

``` sql
CREATE TABLE public.todos
(
    id serial PRIMARY KEY,
    title text NOT NULL,
    done boolean NOT NULL,
    user_id integer NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
);
```

> Note: After creating the tables, you can run `\d users` and `\d todos` to each display the table properties. It should match the markdown tables above.

## Deployment

<details>
<summary>Deployment tutorial</summary>

The steps below will briefly describe how to integrate CI/CD with [Travis CI](https://travis-ci.org) and deploy with [Heroku](https://www.heroku.com). Make sure you have your repo ready on GitHub.

### 1. Setup accounts

Create accounts for both [Travis CI](https://travis-ci.org) and [Heroku](https://www.heroku.com).

### 2. Setup CLIs

Install the [Travis CLI](https://github.com/travis-ci/travis.rb#installation) and [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) (Optional). They are needed to encrypt your Heroku account's API key for Travis.

> Although you don't necessarily have to install the Heroku CLI, it is still recommended in cases where you need more control onto Heroku.

### 3. Configure Travis CI

After setting up your Travis CI account, in [your account dashboard](https://travis-ci.org/account/repositories), toggle on the repo you wish to have Travis CI connected.

After that, navigate to your newly created repo dashboard, go to settings and configure the environment variables:

| Key               | Value                                             | Comment                                                           |
|-------------------|---------------------------------------------------|-------------------------------------------------------------------|
| DATABASE_URL_TEST | postgres://postgres@localhost:5432/travis_ci_test | Value depends on how you setup your `.travis.yml` if you alter it |
| JWT_SECRET        | &lt;your-jwt-secret&gt;                           | Used only in test (TODO: Mock it)                                 |

> Note: If your build automatically started, you can cancel it since it will fail on deploy.

### 4. Configure Heroku

After setting up your Heroku account, in [your account dashboard](https://dashboard.heroku.com), create a new app.

After that, in your app's dashboard, go the *Resources* tab and add the *Heroku Postgres* add-on.

Next, go to the *Deploy* tab, set *Deployment method* to GitHub and authorize Heroku. Below in the *Automatic deploys* section, check *Wait for CI to pass before deploy* and enable automatic deploys.

Then, go to the *Settings* tab, edit your Config Vars:

| Key                    | Value                                      | Comment                                                       |
|------------------------|--------------------------------------------|---------------------------------------------------------------|
| API_URL_BROWSER        | https://&lt;app-name&gt;.herokuapp.com/api | Your API endpoint used by Axios                               |
| DATABASE_SSL           | true                                       | Heroku Postgres is only accessible with SSL                   |
| JWT_SECRET             | &lt;your-jwt-secret&gt;                    | Your JWT secret key                                           |
| HOST                   | 0.0.0.0                                    | [Required by Nuxt](https://nuxtjs.org/faq/heroku-deployment/) |
| NODE_ENV               | production                                 | [Required by Nuxt](https://nuxtjs.org/faq/heroku-deployment/) |
| NODE_CONFIG_PRODUCTION | false                                      | [Required by Nuxt](https://nuxtjs.org/faq/heroku-deployment/) |

> Note: The config var `DATABASE_URL` should be already set for you once you add the *Heroku Postgres* add-on.

> Note: At this point your project should not be built yet.

### 5. Configure `.travis.yml`

The repo already includes all the configuration needed at `.travis.yml`. You only have to edit the `deploy` section, by [encrypting your Heroku api key](https://www.maniuk.net/2018/04/how-to-generate-secret-for-api-key-for-heroku-deployment-using-travis-ci.html) and replace the `secure: <your-encrypted-heroku-api-key>` value, change `app: penn-todo` to `app: <your-heroku-app-name>` and change `repo: BjornLuG/penn-todo` to `repo: <github-user>/<repo-name>`.

> Note: Although the [Travis CI docs](https://docs.travis-ci.com/user/deployment/heroku/) demonstrates another way to encrypt your Heroku API key, it does not work and will result in failing to decrpyt the API key when deploying. Use the method linked above to encrypt your Heroku API key instead.

### 6. Trigger Travis CI Test

Once you have updated your `.travis.yml`, committed and pushed. Travis CI should automatically start the build. If it doesn't you can manually start it.

After it runs the tests and passes, it will be deployed by Heroku and your site is now live.

### 7. Further reading
* https://devcenter.heroku.com/articles/getting-started-with-nodejs
* https://nuxtjs.org/faq/heroku-deployment/
* https://devcenter.heroku.com/articles/heroku-postgresql
* https://docs.travis-ci.com/user/languages/javascript-with-nodejs/

> Note: If there's any mistakes in the steps listed above, feel free to open an issue.
</details>

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
