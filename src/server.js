const gateway = require("fast-gateway");

const server = gateway({
  routes: [
    {
      prefix: "/admin",
      target: "http://localhost:5001",
    },
    {
      prefix: "/users",
      target: "http://localhost:5002",
    },
    {
      prefix: "/locations",
      target: "http://localhost:5003",
    },
  ],
});

server.start(5000).then(() => {
  console.log("API Gateway started at port 5000");
});
