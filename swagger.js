// swagger.js (in root)
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Sign Up API",
      version: "1.0.0",
      description: "signup api for devtinder application",
    },
    servers: [
      {
        url: "http://localhost:7777", // change if using a different port
      },
    ],
  },
  apis: ["./src/routes/**/*.js"], // points to all JS files in routes folder
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
