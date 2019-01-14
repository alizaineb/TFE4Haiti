# TFE4Haiti
TFE 2018 - 2019

requirements:
 - expressjs
 - mongodb

## Installation
1. Clone the repo :

 - Client :
 ```bash
    cd client/
    npm install

 ```
 - Server :
 ```bash
    cd server/
    npm install
 ```

## Start the web app in dev

Launch 2 terminals and go to the root folder of the project

1. launch client:
```bash
    cd client
    npm start
```
go to [localhost:4200]()

2. launch server:
```bash
    cd server
    npm start
```

go to [localhost:3000]()

## Build the app

Building the app will give you a production version of the client, but served by the server on the same port than the api
```bash
cd clien

ng build --prod --build-optimizer

cd ../server
npm start
```

go to [localhost:3000]()
