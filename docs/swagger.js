import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FastPay API Documentation",
      version: "1.0.0",
      description: "API documentation for FastPay payment service 🚀",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
