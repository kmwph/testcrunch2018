# To-do app
This app was developed for demonstration purpose of Cypress tests for an event TechCrunch 2018.

## Getting Started
This project contains server and client application.
* Server application serves REST API for manipulation with TODOs. All data are stored in memory it means each restart erase all your data.
* Client use the server API and visualize the data to HTML.

### Prerequisites
Both server and client need nodejs for install and run the applications.
Install nodejs: https://nodejs.org (LTS version is recommended)

Checkout application from repository:
```git clone https://github.com/kmwph/testcrunch2018.git```

### Install applications
Install and run process for server and client application is the same:

* Open terminal
* Navigate to application folder ```cd client``` or ```cd server```
* Choose one of the package manager below.

#### Npm
* install packages:
```npm i```

* run an application:
```npm start```

#### Yarn
* install packages:
```yarn```

* run an application:
```yarn start```

## Run tests
Cypress tests expects running both client and server application before tests are started.

* Navigate to client application folder in terminal
* Choose one of these ```npx cypress open``` or ```yarn cypress open```
