# So-Yummy Backend API Documentation

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
  - [Endpoints](#endpoints)
  - [Authentication and Authorization](#authentication-and-authorization)
  - [Request and Response Examples](#request-and-response-examples)
  - [Error Handling](#error-handling)
- [Data Models and Database Schema](#data-models-and-database-schema)
- [API Versioning](#api-versioning)
- [Support and Contact Information](#support-and-contact-information)
- [License and Terms of Use](#license-and-terms-of-use)

## Introduction:

The Recipe storage Backend API allows users to manage recipes, add new one, and create shopping list based on recipe's ingredients. It serves as the data source for the swaggerUI.

The backend application is built using Node.js with Express.js as the web framework, and it utilizes a MongoDB database for data storage.

## Architecture:

The So-Yummy Backend API follows a typical three-tier architecture:

1. Presentation Layer: The swaggerUI that shows in details the API endpoints.
2. Application Layer: The Express.js application that handles incoming requests and manages the business logic.
3. Data Layer: The MongoDB database that stores information about recipes, ingredients, and shopping list.

### Technology Stack

- Node.js: The runtime environment for running the backend application.
- Express.js: The web framework for handling API requests and responses.
- MongoDB: The NoSQL database for storing and retrieving data.
- Mongoose: The MongoDB object modeling tool for interacting with the database.

## API Documentation:

The API is RESTful and adheres to the principles of HTTP methods and status codes. It accepts and returns data in JSON format.

#### Base URL: https://so-yummi.onrender.com

### Endpoints:

#### Users:

- **POST /api/users/register**: Register an user.
- **GET /api/users/verify/{verificationToken}**: Verify the user's account.
- **POST /api/users/verify**: Re-verify the user's account if the verification email letter is lost.
- **POST /api/users/login**: Log in to the user's account.
- **POST /api/users/logout**:Log out from the user's account.
- **GET /api/users/current**: Check if the token is valid.
- **PATCH /api/users/update**: Verify the user's account.
- **POST /api/users/subscription**: Subcribe to newsletter.

#### Ingredients:

- **GET /api/ingredients/list**: Get a list of all ingredients.
- **GET /api/ingredients?q=ingredient**: Get a recipe by ingredient.

#### Recipes:

- **GET /api/recipes/search?q=title**: Get a recipe by title.
- **GET /api/recipes/main-page**: Get a list of recipes sorted by categories.
- **GET /api/recipes/categories/{category}**: Get a list of recipes by category.
- **GET /api/recipes/own**: Get a list of own created recipes.
- **POST /api/recipes/own**: Create a new recipe.
- **DELETE /api/recipes/own**: Delete a recipe by ID.
- **GET /api/recipes/favorites**: Get a list of liked recipes.
- **PATCH /api/recipes/favorites**: Add a liked recipe to favorites.
- **DELETE /api/recipes/favorites**: Delete a recipe by ID.
- **GET /api/recipes/popular**: Get a list of the most popular recipes.
- **GET /api/recipes/{id}**: Get a recipe by ID.
- **GET /api/categories/{id}**: Get a list of recipes' categories.

#### Shopping list:

- **GET /api/shopping-list**: Get a list of ingredients to buy.
- **PATCH /api/shopping-list**: Add an ingredient to the shopping list.
- **DELETE /api/shopping-list**: Delete an ingredient from the shopping list.

### Authentication and Authorization

The API uses JSON Web Tokens (JWT) for authentication. To access the endpoints, clients need to include a valid JWT in the `Authorization` header.

To obtain a JWT, clients must first register as users through the `/users/register` endpoint, and then log in via the `/users/login` endpoint.

### Request and Response Examples

The API supports JSON data format for both request and response bodies. Here are some examples:

**Request:**

```http
POST /api/recipes/own HTTP/1.1
Host: https://so-yummi.onrender.com
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Chicken Enchilada Casserole",
  "category": "Chicken",
  "area": "Mexican",
  "instructions": "Cut each chicken breast in about 3 pieces, so that it cooks faster and put it in a small pot...",
  "description": "A Mexican-inspired casserole made with shredded chicken, enchilada sauce, tortillas, and cheese.",
  "time": "60",
  "youtube": "https://www.youtube.com/watch?v=EtVkwVKLc_M",
  "tags": [],
  "ingredients": [
    {
      "id": "640c2dd963a319ea671e36cb",
      "measure": "14 oz jar"
    },
    {
      "id": "640c2dd963a319ea671e3767",
      "measure": "3 Cups"
    },
    {
      "id": "640c2dd963a319ea671e36b2",
      "measure": "6"
    },
    {
      "id": "640c2dd963a319ea671e3694",
      "measure": "2"
    }
  ]
}
```

**Response:**

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "_id": "6462a8f74c3d0ddd28897fc7"
  "title": "Chicken Enchilada Casserole",
  "category": "Chicken",
  "area": "Mexican",
  "instructions": "Cut each chicken breast in about 3 pieces, so that it cooks faster and put it in a small pot...",
  "description": "A Mexican-inspired casserole made with shredded chicken, enchilada sauce, tortillas, and cheese.",
  "thumb": "https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg",
  "preview": "https://res.cloudinary.com/ddbvbv5sp/image/upload/v1678560403/smb2tdq5ltv4usbnvmt2.jpg",
  "time": "60",
  "youtube": "https://www.youtube.com/watch?v=EtVkwVKLc_M",
  "tags": [],
  "ingredients": [
    {
      "id": "640c2dd963a319ea671e36cb",
      "measure": "14 oz jar"
    },
    {
      "id": "640c2dd963a319ea671e3767",
      "measure": "3 Cups"
    },
    {
      "id": "640c2dd963a319ea671e36b2",
      "measure": "6"
    },
    {
      "id": "640c2dd963a319ea671e3694",
      "measure": "2"
    }
  ],
  "owner": "64b626871c338f1e354728cc",
  "favorite": [],
  "createdAt": "2023-07-18T09:31:19.251Z",
  "updatedAt": "2023-07-18T09:31:19.251Z"
}
```

### Error Handling

The API returns appropriate HTTP status codes and error messages for different scenarios. For example:

- **401 Unauthorized: Email or password is wrong or Email is not verified.**
- **404 Not Found: Recipe, ingredients not found.**
- **500 Internal Server Error: Server Error.**

### Data Models and Database Schema

The backend application uses the following data models:

#### Recipe Model:

```json
{
"_id": "ObjectId",
"title": "string",
"category": "string",
"area": "string",
"instructions": "string",
"description": "string",
"thumb": "string",
"preview": "string",
"time": "string",
"tags": "array",
"ingredients": [{"id": "ObjectId", "measure": "string"}],
"owner": "ObjectId",
"favorite": ["_user": "ObjectId"],
"createdAt": "date",
"updatedAt": "date"
}
```

#### Category Model:

```json
{
"name": "string"
}
```

#### Ingredient Model:

```json
{
"name": "string",
"desc": "string",
"img": "string"
}
```

#### Subscription Model:

```json
{
"user": "ObejctId",
"email": "array",
}
```

#### Shopping list Model:

```json
{
"ingredientId": "ObejctId",
"measures": [{"recipeId":"ObjectId", "measure": "string"}],
}
```
### API Versioning

The API currently has one version:

### Version 1.0 (Current).

Support and Contact Information
For any questions or support, please contact us at support@so-yummy.com.

### License and Terms of Use

The Bookstore Backend API is provided under the MIT License. By using the API, you agree to adhere to the terms and conditions outlined in the license.
`````
