
# NestJS stock management API project 

[![License](https://img.shields.io/github/license/saluki/nestjs-template.svg)](https://github.com/saluki/nestjs-template/blob/master/LICENSE)




- REST API with [TypeOrm](https://typeorm.io/) support 
- Swagger documentation
- Folder structure, code samples and best practices
- Fast HTTP server with [Express](https://expressjs.com/)

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) such as 20.x and NPM

### 1.2 Project configuration

Start by cloning this project on your workstation 

``` sh
git clone https://github.com/lokmanzeddoun/stock-management-api
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./stock-management-api
npm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing the environment variables used for development.

```
vi .env
```





### 1.3 Launch and discover

You are now ready to launch the NestJS application using the command below.

```sh

# Launch the development server with TSNode
npm run dev
```

You can now head to `http://localhost:3000/docs` and see your API Swagger docs. 

## 2. Project structure

This template was made with a well-defined directory structure.

```sh
src/
├── modules
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts # The common module contains pipes, guards, service and provider used in the whole application
│   ├── articles/  # A module example that manages "articles" resources
│   │   │  └── articles.module.ts
│   │   │  └── articles.controller.ts
│   │   │  └── article.entity.ts
│   │   │  └── article.services.ts
│   │   │  └── dto
│   │   │    └── create-article.dto.ts
│   │   │    └── update-article.dto.ts

```

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
npm run start

# Run the application using "ts-node"
npm run dev

# Transpile the TypeScript files
npm run build

# Run the project' functional tests
npm run test

# Lint the project files using TSLint
npm run lint
```

## 5. Stock management support

API for a stock management system serves as a REST endpoint designed to validate the operational status of the service and its associated dependencies. When accessed, the  API initiates an internal evaluation of the overall health of the stock management system. This comprehensive assessment encompasses essential checks such as database connectivity, system configurations, disk space availability, and memory resources.

```sh
curl -H 'Authorization: Bearer ThisMustBeChanged' http://localhost:3000/api/v1/health
```

## 6. Project goals

The goal of this project is to provide a 
 REST API stock management to manage articles  that are built with NestJS.

## 7. Contributing

Feel free to suggest an improvement, report a bug, or ask something: [https://github.com/lokmanzeddoun/stock-management-api/issues](https://github.com/lokmanzeddoun/stock-management-api/issues)