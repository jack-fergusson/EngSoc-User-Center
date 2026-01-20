# EngSoc-User-Center

The official event management website for the Queen's University Engineering Society

Before running, please ensure you have docker and Node installed, and run npm install to install all dependencies.

---

BUILD

To run the build version, run

docker-compose up --build

This will start up the frontend, api gateway, backend services, and mongodb.
At this time, there is no hot reload in build mode.

---

DEV

To work on the frontend, run

cd frontend && npm run dev

Then in a new bash terminal

docker-compose up api-gateway auth-service ...

With any other microservices at the end.

If you want to work on a microservice, do the same but exclude said service from docker, instead starting it up with

cd backend && npm run dev

Which will start the service up with Nodemon, allowing for hot reload.

---

TESTING

Each microservice has it's own suite of tests, found in backend/\*\*/tests.
These can be run from the service's directory with 'npm run test'.
These are unit and integration tests entirely contained within the service.

System-wide docker tests can be rum from the root directory with:

npm run test:system

This will boot up the entire project with a docker image in order to test the api gateway's routing and other full-stack operations.

---

PLEASE start a new branch before editing, and do not push directly to main.

Jack will review pull requests.
