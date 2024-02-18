## How to start

## install

```
node
docker
docker-compose
```

```
cd server
npm install
```

## run

```
mv .env.example .env

docker build -t my-node-app .
docker-compose up

rebuild(optional): docker system prune
```

## Configure database | pgAdmin

### inside pgAdmin create new login/group Roles for dbReadPool and dbCreatePool

for example:

```
Name: dbread
password: dbread
comments: read only access to the db123 table
can login?: yes
inherit rights from the parent roles? yes

Name: dbcreate
password: dbcreate
comments: user with only create or insert
can login?: yes
inherit rights from the parent roles? yes

now, go to db123 databse -> schema -> Tables -> properties of each tables -> Security Tab -> Privileges -> Add row -> here add created roles(e.g for dbcreate give INSERT Privileges, dbread SELECT)

also add user permission on Sequences, dbcreate  with SELECT and USAGE privileges
```

## Run test

run test cases file or run queries manually from test.rest file.

```
npx jest enterprisesService.test.js
```
