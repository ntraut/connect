# Connect

An open platform to save anonymous data coming from any application using this API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software

```
node v12.5+
yarn v1.16+
docker-compose v1.23+
```

### Installing

Setup env variable

```
cp .env.dist .env
```

Edit the .env file to set your custom values.
Then start the docker compose to get a mongo db ready to use

```
docker-compose -d up
```

The project is ready to run

```
yarn start
```

### Running the tests

To run jest tests :

```
yarn test
```
