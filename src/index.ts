import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { User } from './entity/User';
import GroupsController from './controller/GroupsController';
import { RouteDefinition } from './types';

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());
    app.use(helmet());

    [GroupsController].forEach((controller) => {
      // This is our instantiated class
      const instance = new controller();
      // The prefix saved to our controller
      const prefix = Reflect.getMetadata('prefix', controller);
      // Our `routes` array containing all our routes for this controller
      const routes: Array<RouteDefinition> = Reflect.getMetadata(
        'routes',
        controller
      );

      // Iterate over all routes and register them to our express application
      routes.forEach((route) => {
        // It would be a good idea at this point substitute the `app[route.requestMethod]` with a `switch/case` statement
        // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
        // this should be enough for now.

        console.log(
          `- ${route.requestMethod.toUpperCase()} ${prefix}${route.path} to: ${
            controller.name
          }#${route.methodName}`
        );

        const requireUser = Reflect.getMetadata(
          'requireUser',
          controller,
          route.methodName
        );

        const handlers = [];
        if (requireUser) {
          handlers.push(
            (
              req: express.Request,
              res: express.Response,
              next: express.NextFunction
            ) => {
              return res.status(401).send({ message: 'Auth required.' });
            }
          );
        }

        handlers.push(
          (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
          ) => {
            // Execute our method for this path and pass our express request and response object.
            instance[route.methodName](req, res);
          }
        );

        app[route.requestMethod](prefix + route.path, handlers);
      });
    });

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // start express server
    app.listen(3000);

    // insert new users for test
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: 'Timber',
        lastName: 'Saw',
        age: 27,
      })
    );
    await connection.manager.save(
      connection.manager.create(User, {
        firstName: 'Phantom',
        lastName: 'Assassin',
        age: 24,
      })
    );

    console.log('Express server has started on port 3000.');
  })
  .catch((error) => console.log(error));
