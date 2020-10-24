export default {
  swagger: "2.0",
  info: {
    description: "",
    version: "1.0.0",
    title: "Login API",
    termsOfService: "http://swagger.io/terms/",
    contact: {
      email: "marthinkorb@gmail.com",
    },
    license: {
      name: "Apache 2.0",
      url: "http://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  host: "localhost:3333",
  basePath: "",
  tags: [
    {
      name: "Login API",
      description:
        "You can create, read, update and delete the tools from your list.",
    },
  ],
  schemes: ["http", "https"],
  paths: {
    "/users": {
      get: {
        tags: ["Login API"],
        summary: "List all users in system",
        consumes: ["application/json"],
        produces: ["application/json"],
        responses: {
          "200": {
            description: "OK",
            schema: {
              $ref: "#/definitions/Response",
            },
          },
        },
      },
      post: {
        tags: ["Login API"],
        summary: "Create a new user",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            required: true,
            description: "",
            schema: {
              $ref: "#/definitions/Request",
            },
          },
        ],
        responses: {
          "201": {
            description: "Created",
            schema: {
              $ref: "#/definitions/Response",
            },
          },
          "404": {
            description: "Bad request",
            schema: {
              $ref: "#/definitions/BadRequest",
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/tools/{id}": {
      put: {
        tags: ["Login API"],
        summary: "Update an user",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            description: "ID of user to be updated",
            schema: {
              $ref: "#/definitions/Request",
            },
          },
          {
            in: "body",
            name: "body",
            required: true,
            description: "infos of user to be updated",
            schema: {
              $ref: "#/definitions/Request",
            },
          },
        ],
        responses: {
          "200": {
            description: "OK",
            schema: {
              $ref: "#/definitions/Response",
            },
          },
          "404": {
            description: "Failed.",
          },
        },
      },
      delete: {
        tags: ["Login API"],
        summary: "Delete an user",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            description: "ID of user to be deleted",
            schema: {
              $ref: "#/definitions/Request",
            },
          },
        ],
        responses: {
          "200": {
            description: "User deleted",
            schema: {
              $ref: "#/definitions/Response",
            },
          },
          "404": {
            description: "User not found.",
          },
        },
      },
    },
  },
  securityDefinitions: {
    tools_auth: {
      type: "oauth2",
      authorizationUrl: "",
      flow: "implicit",
      scopes: {
        "write:tools": "",
        "read:tools": "",
      },
    },
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header",
    },
  },
  definitions: {
    Update: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
      },
    },
    Request: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
      },
    },
    Response: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        name: {
          type: "string",
        },
        email: {
          type: "string",
        },
        password: {
          type: "string",
        },
        created_at: {
          type: "timestamp",
        },
        updated_at: {
          type: "timestamp",
        },
      },
    },
    BadRequest: {
      type: "object",
      properties: {
        message: {
          type: "string",
        },
        errors: {
          type: "object",
          properties: {
            description: {
              type: "string",
            },
          },
        },
      },
    },
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io",
  },
};
