# WTT-PMS-WEBSERVER

[![Build Status](https://travis-ci.org/hagopj13/node-express-boilerplate.svg?branch=master)](https://github.com/walkingtree/wtt-pms-webserver)
[![Coverage Status](https://coveralls.io/repos/github/hagopj13/node-express-boilerplate/badge.svg?branch=master)](https://github.com/walkingtree/wtt-pms-webserver)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/walkingtree/wtt-pms-webserver)

## NodeJs Version

`Node: v18.12.1` \
`npm: 8.19.2`

## Commands

### Setup project

```bash
#  clone the repo
git clone https://github.com/walkingtree/wtt-pms-webserver.git

# go to the project directory
cd .\wtt-pms-webserver\

# install the required packages
npm i
```

### Run project

```bash
# run the application on production environment
npm start

# run the application on dev environment
npm run dev
```

#### API Documentation

To view the list of available APIs and their specifications, run the server in dev environment and go to `http://localhost:5000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### Testing:

```bash
# run all tests
npm test

# run all tests in watch mode
npm run test:watch

# run test coverage
npm run coverage
```

### Docker:

```bash
# run docker container in development mode
npm run docker:dev

# run docker container in production mode
npm run docker:prod

# run all tests in a docker container
npm run docker:test
```

### Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
 |--templates\      # Email templates
```

## How add new Model

Go To the `src/models` and create new file `<model_name>.js`.

Sample code given blow to create the Model.

```bash
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const yourSchemaName = mongoose.Schema(
  {
    # All the fields of the Model
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      # validation for the field
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
       # validation for the field
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, #used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

# add plugin that converts mongoose to json
yourSchemaName.plugin(toJSON);
yourSchemaName.plugin(paginate);


 # Check if email (field_name) is taken
 # @param {string} email - The user's email
 # @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 # @returns {Promise<boolean>}

yourSchemaName.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email , _id: { $ne: excludeUserId } });
  return !!user;
};


 # Check if password matches the user's password
 # @param {string} password
 # @returns {Promise<boolean>}

yourSchemaName.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

yourSchemaName.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});


# @typedef User
const User = mongoose.model('User', yourSchemaName); # to add created model in the mongoose database

module.exports = User;

```
after creating model in the `src/models` you have to add same schema in the `src/docs/components.yml` file for the swagger documentation.


You have to add your schema under the `schemas` property with all the schema fields and it's data type in a below format with one example as shown below:-
```bash
components:
  schemas:
    yourSchemaName:
      type:object
      properties:
        id:
          type:string
        yourSchemaField1:
          type: yourSchemaFieldDataType
        ...... #all you schema fields will listed here
        example:
          id: fakeID
          yourSchemaField1: fakeValue
          ..... #all your schema fields with fake value will listed here
    User:
      type: object
      properties:
        id:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        designation:
          type: string
        mobileNumber:
          type: string
        emailAddress:
          type: string
          format: email
          description: must be unique
        createdByUserId:
          type: string
        modifiedByUserId:
          type: string
        createdAt:
          type: date
        updatedAt:
          type: date
        password:
          type: string
          format: password
          minLength: 8
          description: At least one number and one letter
        role:
          type: string
          enum: [user, admin]
      example:
        id: 5ebac534954b54139806c112
        email: fake@example.com
        name: fake name
        role: user
        createdByUserId: 5ebac534954b54139806c112
        modifiedByUserId: 5ebac534954b54139806c112
        createdAt: '2023-02-10T11:15:48.637+00:00'
        updatedAt: '2023-02-10T11:15:48.637+00:00'

    SystemRoles:
      type: object
      properties:
        name:
          type: string
        description:
          type: string
          description: must be unique
        isDefault:
          type: string
        createdByUserId:
          type: string
        modifiedByUserId:
          type: string
        createdAt:
          type: date
        updatedAt:
          type: date
      example:
        id: 5ebac534954b54139806c112
        name: fake@example.com
        description: fake name
        createdByUserId: 5ebac534954b54139806c112
        modifiedByUserId: 5ebac534954b54139806c112
        createdAt: '2023-02-10T11:15:48.637+00:00'
        updatedAt: '2023-02-10T11:15:48.637+00:00'

    Token:
      type: object
      properties:
        token:
          type: string
        expires:
          type: string
          format: date-time
      example:
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
        expires: 2020-05-12T16:18:04.793Z

    AuthTokens:
      type: object
      properties:
        access:
          $ref: '#/components/schemas/Token'
        refresh:
          $ref: '#/components/schemas/Token'

    Error:
      type: object
      properties:
        code:
          type: number
        message:
          type: string

  responses:
    DuplicateEmail:
      description: Email already taken
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: 400
            message: Email already taken
    DuplicateRole:
      description: Role already exists
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: 400
            message: Role already exists
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: 401
            message: Please authenticate
    Forbidden:
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: 403
            message: Forbidden
    NotFound:
      description: Not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: 404
            message: Not found

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

```

## How To Validate Routes based on the User Role

##### Step 1 : Define the Role with access rights
To validated routes based on the user role you can find `src/config/role.js` file where all the roles are define with there access rights and if you want you can add more roles.
Like given below, In the below example you can see one allRoles object that contains all the roles with there access rights. Like `user` has no access right and `admin` has the access right to `getUsers` & `manageUsers`.

```bash
const allRoles = {
  user: [],

  admin: ['getUsers', 'manageUsers'],

};
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

```

##### Step 2 : Add role validation for route
To add role validation for any route you just need to pass auth validator function with the accessRight of the route like `auth('accessRight')`.
For example:
###### 1:  route that anyone can access
`router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);`

###### 2:  route that only login user can access
`router.post('/send-verification-email', auth(), authController.sendVerificationEmail);`

###### 3:  route that only login user with `manageUsers` access right can access
`router.route('/').post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser);`


## How To Add Swagger config for the api route

To write swagger config for your route follow the given below format.

```bash
/**
 * @swagger # start with @swagger
 * /users/{id}:  # your route access point
 *   get: # method type like post, get, put, delete & patch.
 *     summary: Get a user # write the use of this route
 *     description: Logged in users can fetch only their own user information. Only admins can fetch other users. # write the brief description of who can access the route and what data will it provide
 *     tags: [Users] # add the tag under which this route will come
 *     security:
 *       - bearerAuth: [] # if Bearer Token is required by the route
 *     parameters: # under parameters define all the parameters that will come in request object.
 *       - in: path # write the position where the specifice parameter will come. Like  body, formdata, hearder , etc.
 *         name: id # define the name of the parameter
 *         required: true # true if the paremeter is required/mandatory.
 *         schema:
 *           type: string # datatype of the parameter
 *         description: User id
 *     responses: # here you need to define the all the possible reponses
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

```
Above example is of the get request if you want to see more examples use can see them in `src/controllers/auth.controller.js` or `src/controllers/user.controller.js`


## How To Create new API's

There are two ways you can add create new API.

#### 1: First is by adding routes to an existing route
You can find existing routes in `src/routes/v1/index.js` file where we have `defaultRoutes` array of objects that contains all the routes and `devRoutes` array of objects that contains the routes that will be accessable only in dev environment.

##### index.js
```bash
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
```
#### 2: second is by adding new route
You can find existing routes in `src/routes/v1/index.js` file where we have `defaultRoutes` array of objects that contains all the routes and `devRoutes` array of objects that contains the routes that will be accessable only in dev environment.
Just need to add one new route to an `defaultRoutes` or `devRoutes` object like given below.
##### index.js
```bash
const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
  # add your new route here
  {
  path:'/route_name',
  route:yourRoute
  }
];

const devRoutes = [
  // routes available only in development mode
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
```

After adding new route to an `index.js` file you need to create four files i.e.
1. route_name.route.js file in `src/routes/v1`.
2. route_name.validation.js file in `src/validations/`.
3. route_name.controller.js file in `src/controllers/`.
4. route_name.service.js file in `src/services/`.


Example is given below for the `/user` route.

Now, lets add one post api to the user route.  For that we have to goto `user.route.js` file that you will found in `src/routes/v1/user.route.js`.


For each api you also need to add the swagger code for autogenration of swagger documentation of the api's as given below.

for each route file we also need to create controller file to perform the action and validation file to validate the payload. For example for user route we `src/validations/user.validation.js` & `src/controllers/user.controller.js`.

##### user.route.js
```bash
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

# adding new api route
router.post('/<route_name>'), Validate(userValidation.<your_validation>, userController.<your_method>);


module.exports = router;

## Her you have to add your swagger config for your User Route here
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
```

 after adding new api route you need to add the validation object inside the `user.validation.js` file with the name that you have passed in the route. \n
 For Example:

 ##### user.validation.js
```bash
const Joi = require('joi');
const { password, objectId, mobileNumber } = require('./custom.validation');
const { roles } = require('../config/roles');

# add your validation object  here
const <your_validation> = {
# validating the body parameter
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    mobileNumber: Joi.string().required().custom(mobileNumber),
    emailAddress: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};


# export `your_validation` here so that it will be accessable outside of this file
module.exports = {
 <your_validation>
};

```

after adding new api route you need to add the logic to handle your route inside the `user.controller.js` file with the name that you have passed in the route. \n
 For Example:

 ##### user.controller.js
 ```bash
 const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

# create you controller method here and also export it with swagger config
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Only admins can retrieve all users.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: First name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Last name
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *         description: Designation
 *       - in: query
 *         name: mobileNumber
 *         schema:
 *           type: string
 *         description: Mobile Number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: User role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of users
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
const <your_method> = catchAsync(async (req, res) => {
  //your logic to handle the route
  const filter = pick(req.query, ['firstName', 'lastName', 'designation', 'mobileNumber', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

module.exports = {
  # export you controller method here
  <your_method>,
};

 ```

after adding controller for handling you route in `your_route.controller.js` file you have to add the function in the `your_route.service.js` file that you have called in controller file as given below for `user.service.js`:-

##### user.service.js
```bash
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => { #method with the name that you have called in controller service
#all the logic will come here....
  if (await User.isEmailTaken(userBody.emailAddress)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ emailAddress: email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.emailAddress && (await User.isEmailTaken(updateBody.emailAddress, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

```


## Used boilerplate

A boilerplate/starter project for quickly building RESTful APIs using Node.js, Express, and Mongoose.

By running a single command, you will get a production-ready Node.js app installed and fully configured on your machine. The app comes with many built-in features, such as authentication using JWT, request validation, unit and integration tests, continuous integration, docker support, API documentation, pagination, etc. For more details, check the [documentation](https://github.com/hagopj13/node-express-boilerplate).
