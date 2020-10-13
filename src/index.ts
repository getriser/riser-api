import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { app } from './app';

// Information on Decorators here.
// https://nehalist.io/routing-with-typescript-decorators/
createConnection('default')
  .then(async (connection) => {
    // start express server
    app.listen(3000, () => {
      console.log('Express server has started on port 3000.');
    });
  })
  .catch((error) => console.log(error));
