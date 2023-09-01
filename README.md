 # Scheduler Application

 
## Setup

This software uses docker to deploy. First download and install [Docker](https://www.docker.com/products/docker-desktop/) on your machine

### Deploy Production App

In terminal or cmd set your working directory to `[path]/[to]/scheduler`
Build the production app using:

    docker-compose -f docker-compose-prod.yml build

Then start the app using:

    docker-compose -f docker-compose-prod.yml up -d

If the app was successfully deployed, the client will be available at `localhost:80`
Note: This app uses port 8000 for the Express.js API, make sure this port is not occupied before building/deploying the app. 

To stop the application:

    docker-compose -f docker-compose-prod.yml down

### Deploy Development Environment

Make sure you have followed the Docker setup mentioned above and loaded the necessary images.

The development environment requires [Node.js](https://nodejs.org) to be installed on your machine. 

Install npm:

    npm install -g npm

Next build and deploy the docker development environment while in the `[path]/[to]/scheduler` working directory.

    docker-compose -f docker-compose-dev.yml build
    docker-compose -f docker-compose-dev.yml up -d
    
This will start:
 1. A MySQL database container
 2. An Express.js API container with port 8000 exposed
 3. A PhpMyAdmin container accessible at `localhost:8081`

Then navigate to `[path]/[to]/scheduler/client` working directory and start the React.js development server using:

    npm start

The development client will be available at `localhost:3000`
Saved edits to the source code will automatically populate to the react app. 
When ready to build the application run:

    npm run build
    
This will create optimized code stored in `/scheduler/client/build` that can be served. 
Note: This build file is what is used when deploying the production version of the application using:

    docker-compose -f docker-compose-prod.yml build
    docker-compose -f docker-compose-prod.yml up -d
    
This production build uses the optimized client code and a lightweight [Nginx](https://www.nginx.com/) web server.

To access the application when the production docker-compose is running, navigate to `localhost:80`

### Notes
Data is persisted for the MySQL containers at `/scheduler/mysql/persistent_data` this ensures that data added through the application is not lost when redeploying the MySQL Docker container. 

A database backup file is included at `/scheduler/mysql/init.sql` that can be added to the application via PhpMyAmin deployed with the development environment. 

To get started use one of the following demo logins:
username/email: user
|email|password|
|--|--|
|user|user|
|admin|admin|
|read|read|

Logging in with `admin` grants privileges to approve reservation requests and to add users.

After initial application setup, phpmyadmin can be used to change data to satisfy organizational needs. User credentials can also be removed using this method. 
