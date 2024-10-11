## Summary
A chatbot application asking the user about cats. Architecture built with NestJS, ReactJS and MongoDB with heavy leaning on service infrastructure.

This is a mono-repo which contains bot the front-end and back-end code. 

Navigate to /src/client to review front-end content.

### TL;DR Run Rhe App
Copy the .env variables to root and src/client folders, run the following command within the root folder. You need to have MongoDB running.

##### Important: If you don't have the necessary .env files, copying below variables will help you get started. Please get a Cohere API key though.

server .env:
```bash
DB_URL=mongodb://127.0.0.1:27017/bolt-chatbot
JWT_SECRET=someSecret
COHERE_API_SECRET=GET_YOUR_API_SECRET_FROM_COHERE
```

client .env:
```bash
REACT_APP_API_URL=http://localhost:3000/api
```

Run the below command within the root folder.
```bash
$ yarn && cd src/client && yarn && yarn build && cd .. && yarn start
```

Review the app, [visit the local app](http://localhost:3000)

## Table of contents 
1. [Installation](#installation)  
1.1 [Back-end](#back-end-installation)  
1.2 [Front-end](#front-end-installation)  
2. [Production](#production)
3. [Response generation with LLM](#response-generation-with-llm)  
4. [Real time communications](#real-time-communications)
5. [Authentication](#authentication) 
6. [Validation](#validation)

## Installation

### Back-end installation
Created with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

##### Important: In order to be able to run this project, you need to have MongoDB installed. You can edit your .env file at server level to connect to your MongoDB instance or use the predefined URL on initial .env file.
##### Currently there is no authentication method on MongoDB URL, you need to add your own authentication method if you change the database URL.

#### Install dependencies
```bash
$ yarn install
```

#### Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Front-end installation
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

#### Install dependencies
```bash
$ yarn install
```

#### Compile and run the project

```bash
# client folder
cd src/client

# development
$ yarn start

# build
$ yarn build
```

## Production
Change the environment variables to your production variables. 

We are serving a static SPA ReactJS build, in order to use this build you need to run build command first. After this step the server will be able to provide both projects from a single route.

##### Important: Server endpoints are globally marked with /api endpoint.

## Response generation with LLM
In order to create a lively experience when a user interacts with the bot, we leveraged the power of Cohere AI(free plan). The responses are generated depending on the chat step(0-9-finished).

## Real time communications
Real-time commumications are handled with socket.io and socket.io-client libraries, message and connection handling are handled by SessionGateway service on server, and useSessionWs on client. Authentication handled with a top level AuthGuard on SessionGateway. Your connection strings should have an auth token.

##### Important: Chat sessions are marked with the namespace of /session. The connection string should be url/session.

## Authentication
Authentication methods are handled by AuthGuards on top or method level, both for socket connections and REST APIs. The current authentication method is a logn-living(24h) JWT token, served with authentication header.

## Validation
Using the class-validators library and a top level validation pipeline, we handle data validations with DTO object classes, handling the process and errors via props before accessing the method definition.