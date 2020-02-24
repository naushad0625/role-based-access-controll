const express = require('express');
const ErrorHandler = require('../helpers/error-handler.js');
const UserController = require('../controllers/user-contorller.js');
const permissionManager = require('../middlewares/permission-middleware.js');


const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');



class RootRouter {
    constructor() {
        this.router = express.Router();
        this.errorHandler = new ErrorHandler();
        this.userController = new UserController();

        this.configureRoutes();
    }

    configureRoutes() {
        this.router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
        this.router.use(permissionManager.checkAuthentication);

        //POST requests
        this.router.post('/login', this.userController.login);
        this.router.post('/register', this.userController.register);


        //GET requests
        this.router
            .get(
                '/user/:user_id',
                permissionManager.allowCurrentUser,
                this.userController.getUserById
            );
        this.router
            .get(
                '/users',
                permissionManager.allowCurrentUser,
                permissionManager.grantPermission('readAny', 'profile'),
                this.userController.getUsers
            );

        //PUT requests
        this.router
            .put(
                '/user/:user_id',
                permissionManager.allowCurrentUser,
                permissionManager.grantPermission('updateAny', 'profile'),
                this.userController.updateUserById
            );

        //DELETE requests
        this.router
            .delete(
                '/user/:user_id',
                permissionManager.allowCurrentUser,
                permissionManager.grantPermission('deleteAny', 'profile'),
                this.userController.deleteUserById
            );
    }

    getRouter() {
        return this.router;
    }

}

module.exports = RootRouter;