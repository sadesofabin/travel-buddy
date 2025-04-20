require("dotenv").config();
const gateway = require("fast-gateway");

let admin = process.env.ADMIN_SERVICE;
let users = process.env.USERS_SERVICE;
let locations = process.env.LOCATIONS_SERVICE;

// Use production URLs if env is PROD
if (process.env.URL === "PROD") {
  admin = process.env.ADMIN_SERVICE_PROD;
  users = process.env.USERS_SERVICE_PROD;
  locations = process.env.LOCATIONS_SERVICE_PROD;
}

const server = gateway({
  routes: [
    {
      prefix: "/admin",
      target: admin,
    },
    {
      prefix: "/users",
      target: users,
    },
    {
      prefix: "/locations",
      target: locations,
    },
  ],
});

server.start(5000).then(() => {
  console.log("API Gateway started at port 5000");
});
