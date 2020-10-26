import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import SessionsController from './controllers/SessionsController';
import UsersController from './controllers/UsersController';

import ensureAuthenticated from './middlewares/ensureAuthenticated';

import swaggerConfigs from './swagger';

const routes = Router();

routes.use('/api-docs', swaggerUi.serve);

routes.get('/api-docs', swaggerUi.setup(swaggerConfigs));

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);
routes.put('/users/:id', ensureAuthenticated, UsersController.edit);
routes.delete('/users/:id', UsersController.delete);

routes.post('/sessions', SessionsController.create);

export default routes;
