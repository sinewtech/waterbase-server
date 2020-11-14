# How to setup your own waterbase server

This is a quick and dirty tutorial on how you would initialize your waterbase server.

# Server

This tutorial will be done on a linux VPS (Ubuntu 20.04)

## Get the server

Clone the repo

```bash
git clone http://github.com/sinewtech/waterbase-server
```

cd to the repo

```bash
cd waterbase-server
```

after this step make sure to run the commands on the repo directory

## Docker

As you should know the whole waterbase server works on a docker "image" that we are building, so this step is pretty self explanatory...

Have docker installed...

We used a premade docker image on [Digital Ocean](https://digitalocean.com).

If you will be installing docker, please click [here](https://docs.docker.com/engine/install/ubuntu/)
and make sure you install docker-compose as well.

## Setup the server

First step to make sure to do is to make your own .env

```bash
cp .env.template .env
```

and edit it

```bash
vim .env
```

on it you should see something like this

```
NODE_ENV=development
API_KEY="xxxxxxxxxx"
JWT_ACCESS_KEY="xxxxxx"
FILES_FOLDER="archive"
SALT_ROUNDS="xx";
MONGO_PORT="XXXX"
MONGO_IP="xxxx"
MONGO_DB="xxxx"
MONGO_USER="xxxx"
MONGO_PASS="xxxx"
```

we will take a look at each one and why its set like that.

- NODE_ENV
  - Is just a variable to know if theres an error if it should display the error stack or if it should display an stack 🥞.
- API_KEY
  - This is the secret key that the configuration asks for on the sdk.
- JWT_ACCESS_KEY
  - This the JWT secret for your access tokens, please keep it completly secret and it should be fairly complex.
- FILES_FOLDER
  - This where all of our file will be stored (remember the name that you placed here is important for our docker configuration)
- SALT_ROUNDS

  - This is the salt rounds for your password hash (10 is the defualt but if you have the compute power place a high number)

- MONGO_PORT

  - This the port where your mongo server is.

- MONGO_IP

  - This is the ip where your mongo server is (if you will use waterbase's mongo make sure to leave it as 'mongo')

- MONGO_DB

  - This is the name that your waterbase database inside mongo will have

- MONGO_USER

  - This is the username for the waterbase queries

- MONGO_PASS
  - This is the password for the user on mongo

once you setup all of variables, it should look something like this:

```
NODE_ENV=development
API_KEY="123456789"
JWT_ACCESS_KEY="shhh my secret"
FILES_FOLDER="archive"
SALT_ROUNDS="10"
MONGO_PORT="27017"
MONGO_IP="mongo"
MONGO_DB="waterbase"
MONGO_USER="waterbase"
MONGO_PASS="random password"
```

Now the next step is to set up the database initializer

```bash
vim init-mongo.js
```

on here you should see something like this:

```js
db.createUser({
  user: 'waterbase',
  pwd: 'random password',
  roles: [
    {
      role: 'readWrite',
      db: 'waterbase',
    },
  ],
});
```

note that this configuration most match with your .env configuration, so please set the user and pwd (password) as they should, and inside the roles array, set the db to the database name that your set on the .env.

Final step is going to modify the docker-compose.yml
if you changed the FILES_FOLDER on the .env, make sure that you set it on the volumes for our image

```yml
server:
  build: .
  ports:
    - '1217:1217'
  volumes:
    - ./logs:/usr/src/server/logs
    - ./archive:/usr/src/server/archive
  depends_on:
    - mongo
```

Right where it says './archive' change it and on the end change it for your variable (if you happen to know a better way to do this, please help us out).

## Run server

Now this is where it becomes tricky... just kidding

now just run

```bash
docker-compose up -d
```

and that should spin up your server ready to be used,
on the port 1217, so for the endpoint on your sdk instance type something like this

```js
const wb = require('waterbase');
wb.initialize({
  endpoint: 'http://myserverip:1217/api',
  secretKey: 'this is the .env API_KEY',
});
```

## Problems you could face

### Firewall

If you happen to have connecting but everything is running well, take a look at your server firewall, it could be blocking the ports we ask for
