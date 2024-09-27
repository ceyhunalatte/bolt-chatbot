## Summary
A chatbot application asking the user about cats. Architecture built with NestJS, ReactJS and MongoDB with heavy leaning on service infrastructure.

## Table of contents 
1. [Installation](#installation)  
1.1 [Back-end](#back-end-installation)  
1.2 [Front-end](#front-end-installation)  
2. [Response generation with LLM](#response-generation-with-llm)  
3. [Real time communications](#real-time-communications)
4. [Authentication](#authentication) 
5. [Validation](#validation)

## Installation

### Back-end installation
Created with [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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
# development
$ yarn start

# build
$ yarn build
```

## Response generation with LLM
In order to create a lively experience when a user interacts with the bot, we leveraged the power of Cohere AI(free plan). The responses are generated depending on the chat step(0-9-finished).

## Real time communications
Real-time commumications are handled with socket.io and socket.io-client libraries, message and connection handling are handled by SessionGateway service on server, and useSessionWs on client. Authentication handled with a top level AuthGuard on SessionGateway.

## Authentication
Authentication methods are handled by AuthGuards on top or method level, both for socket connections and REST APIs.

## Validation
Using the class-validators library and a top level validation pipeline, we handle data validations with DTO object classes, handling the process and errors via props before accessing the method definition.