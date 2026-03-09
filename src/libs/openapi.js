// src/libs/openapi.js

const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export const openapi = {
  openapi: "3.0.0",
  info: {
    title: "Ordering App API",
    version: "1.0.0",
    description: "API specifikacija za aplikaciju za poručivanje hrane (ITEH).",
  },
  servers: [{ url: baseUrl, description: "API server" }],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "next-auth.session-token",
        description:
          "NextAuth session cookie (u dev okruženju može biti i __Secure-next-auth.session-token).",
      },
    },

    schemas: {
      ObjectId: {
        type: "string",
        example: "65fd1234abcd5678ef901234",
      },

      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string", example: "Upload failed" },
        },
        additionalProperties: true,
      },

      Category: {
        type: "object",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string", example: "Pice" },
        },
        additionalProperties: true,
      },

      CategoryCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Pice" },
        },
        additionalProperties: false,
      },

      CategoryUpdate: {
        type: "object",
        required: ["_id", "name"],
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string", example: "Paste" },
        },
        additionalProperties: false,
      },

      MenuItem: {
        type: "object",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string", example: "Ćevapi" },
          description: { type: "string", example: "10 kom + luk" },
          basePrice: { type: "number", example: 450 },
          image: { type: "string", example: "https://example.com/img.jpg" },
          category: {
            description: "U bazi je ObjectId reference na Category dokument",
            $ref: "#/components/schemas/ObjectId",
          },
          sizes: { type: "array", items: { type: "object", additionalProperties: true } },
          extraIngredientPrices: { type: "array", items: { type: "object", additionalProperties: true } },
        },
        additionalProperties: true,
      },

      MenuItemCreate: {
        type: "object",
        description:
          "U kodu se prosleđuje ceo JSON u MenuItem.create(data), dozvoljena su i dodatna polja.",
        required: ["name", "basePrice"],
        properties: {
          name: { type: "string", example: "Ćevapi" },
          basePrice: { type: "number", example: 450 },
          description: { type: "string", example: "10 kom + luk" },
          category: { $ref: "#/components/schemas/ObjectId" },
          image: { type: "string", example: "https://example.com/img.jpg" },
          sizes: { type: "array", items: { type: "object", additionalProperties: true } },
          extraIngredientPrices: { type: "array", items: { type: "object", additionalProperties: true } },
        },
        additionalProperties: true,
      },

      MenuItemUpdate: {
        type: "object",
        required: ["_id"],
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string" },
          basePrice: { type: "number" },
          description: { type: "string" },
          category: { $ref: "#/components/schemas/ObjectId" },
          image: { type: "string" },
          sizes: { type: "array", items: { type: "object", additionalProperties: true } },
          extraIngredientPrices: { type: "array", items: { type: "object", additionalProperties: true } },
        },
        additionalProperties: true,
      },

      RegisterBody: {
        type: "object",
        description:
          "Kod prosleđuje ceo body u User.create(body). Password se hash-uje pre snimanja.",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "test@test.com" },
          password: { type: "string", example: "lozinka123" },
          name: { type: "string", example: "Test User" },
          image: { type: "string", example: "https://example.com/avatar.jpg" },
        },
        additionalProperties: true,
      },

      User: {
        type: "object",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          email: { type: "string", example: "test@test.com" },
          name: { type: "string", example: "Test User" },
          image: { type: "string", example: "https://example.com/avatar.jpg" },
        },
        additionalProperties: true,
      },

      ProfileUpdate: {
        type: "object",
        description:
          "Kod uzima {_id, name, image, ...otherUserInfo} i upisuje User i UserInfo.",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string", example: "Tamara" },
          image: { type: "string", example: "https://example.com/avatar.jpg" },
          phone: { type: "string", example: "+38160123456" },
          streetAddress: { type: "string", example: "Bulevar..." },
          postalCode: { type: "string", example: "11000" },
          city: { type: "string", example: "Beograd" },
          country: { type: "string", example: "Serbia" },
        },
        additionalProperties: true,
      },

      ProfileResponse: {
        type: "object",
        description: "GET /api/profile vraća spojen objekat: User + UserInfo.",
        additionalProperties: true,
      },

      CartProduct: {
        type: "object",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          name: { type: "string", example: "Ćevapi" },
          size: { type: "object", additionalProperties: true },
          extras: { type: "array", items: { type: "object", additionalProperties: true } },
        },
        additionalProperties: true,
      },

      CheckoutBody: {
        type: "object",
        required: ["cartProducts", "address"],
        properties: {
          cartProducts: { type: "array", items: { $ref: "#/components/schemas/CartProduct" } },
          address: {
            type: "object",
            description:
              "Kod radi Order.create({ userEmail, ...address, cartProducts, paid:false }).",
            additionalProperties: true,
          },
        },
        additionalProperties: true,
      },

      Order: {
        type: "object",
        properties: {
          _id: { $ref: "#/components/schemas/ObjectId" },
          userEmail: { type: "string", example: "test@test.com" },
          cartProducts: { type: "array", items: { $ref: "#/components/schemas/CartProduct" } },
          paid: { type: "boolean", example: false },
        },
        additionalProperties: true,
      },
    },
  },

  paths: {
    "/api/swagger": {
      get: {
        summary: "Vrati OpenAPI specifikaciju (JSON)",
        responses: {
          200: { description: "OK" },
        },
      },
    },

    "/api/menu-items": {
      get: {
        summary: "Vrati sve stavke menija",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/MenuItem" } },
              },
            },
          },
          500: { description: "Internal Server Error" },
        },
      },
      post: {
        summary: "Kreiraj novu stavku menija (admin)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemCreate" } } },
        },
        responses: {
          200: {
            description: "OK (kreirano) ili prazan objekat ako nisi admin",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/MenuItem" } },
            },
          },
        },
      },
      put: {
        summary: "Ažuriraj stavku menija (admin)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemUpdate" } } },
        },
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "boolean", example: true } } },
          },
        },
      },
      delete: {
        summary: "Obriši stavku menija (admin)",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "query",
            required: true,
            schema: { $ref: "#/components/schemas/ObjectId" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "boolean", example: true } } },
          },
        },
      },
    },

    "/api/categories": {
      get: {
        summary: "Vrati sve kategorije",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Category" } },
              },
            },
          },
          500: { description: "Internal Server Error" },
        },
      },
      post: {
        summary: "Kreiraj kategoriju (admin)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryCreate" } } },
        },
        responses: {
          200: {
            description: "OK (kreirano) ili prazan objekat ako nisi admin",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Category" } },
            },
          },
        },
      },
      put: {
        summary: "Ažuriraj kategoriju (admin)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryUpdate" } } },
        },
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "boolean", example: true } } },
          },
        },
      },
      delete: {
        summary: "Obriši kategoriju (admin)",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "query",
            required: true,
            schema: { $ref: "#/components/schemas/ObjectId" },
          },
        ],
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "boolean", example: true } } },
          },
        },
      },
    },

    "/api/orders": {
      get: {
        summary: "Vrati porudžbine (lista ili pojedinačna po _id)",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "query",
            required: false,
            schema: { $ref: "#/components/schemas/ObjectId" },
            description: "Ako se prosledi, vraća Order.findById(_id).",
          },
        ],
        responses: {
          200: {
            description:
              "OK: može biti Order objekat (ako je _id prosleđen) ili lista Order objekata",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/Order" },
                    { type: "array", items: { $ref: "#/components/schemas/Order" } },
                  ],
                },
              },
            },
          },
        },
      },
    },

    "/api/profile": {
      get: {
        summary: "Vrati profil (ulogovani ili po _id)",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "_id",
            in: "query",
            required: false,
            schema: { $ref: "#/components/schemas/ObjectId" },
          },
        ],
        responses: {
          200: {
            description: "OK ili {} ako nema session",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileResponse" } } },
          },
        },
      },
      put: {
        summary: "Ažuriraj profil",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileUpdate" } } },
        },
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "boolean", example: true } } },
          },
        },
      },
    },

    "/api/register": {
      post: {
        summary: "Registracija korisnika",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterBody" } } },
        },
        responses: {
          200: {
            description: "OK (kreiran korisnik)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
        },
      },
    },

    "/api/auth/[...nextauth]": {
      get: { summary: "NextAuth handler", responses: { 200: { description: "OK" } } },
      post: { summary: "NextAuth handler", responses: { 200: { description: "OK" } } },
    },

    "/api/upload": {
      post: {
        summary: "Upload fajla na S3 (multipart/form-data, field: file)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "OK (vraća link kao JSON string)",
            content: {
              "application/json": {
                schema: { type: "string", example: "https://bucket.s3.region.amazonaws.com/menu/abc.jpg" },
              },
            },
          },
          400: {
            description: "Bad Request (No file)",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
          500: {
            description: "Internal Server Error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },

    "/api/checkout": {
      post: {
        summary: "Checkout (Stripe) kreira Order i vraća Stripe checkout URL (JSON string)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CheckoutBody" } } },
        },
        responses: {
          200: {
            description: "OK (Stripe session URL kao string)",
            content: {
              "application/json": {
                schema: { type: "string", example: "https://checkout.stripe.com/c/pay/cs_test_..." },
              },
            },
          },
        },
      },
    },

    "/api/webhook": {
      post: {
        summary: "Stripe webhook",
        responses: {
          200: {
            description: "OK",
            content: { "application/json": { schema: { type: "string", example: "ok" } } },
          },
          400: { description: "Bad Request (Stripe signature error)" },
        },
      },
    },

    "/api/users": {
      get: {
        summary: "Lista korisnika (admin), vraća [] ako nije admin",
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/User" } },
              },
            },
          },
        },
      },
    },
  },
};