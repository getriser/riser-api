import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { app } from './app';
import DevelopmentService from './services/DevelopmentService';

createConnection('default')
  .then(async (connection) => {
    await DevelopmentService.initializeDevelopmentData();

    // start express server
    app.listen(3000, () => {
      console.log('Express server has started on port 3000.');
    });
  })
  .catch((error) => console.log(error));
