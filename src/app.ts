// create express app
import * as express from 'express';
import { serve, generateHTML } from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import { RegisterRoutes } from '../build/routes';

export const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// app.use(cors());
// app.use(helmet());

app.use(
  '/docs',
  serve,
  async (_req: express.Request, res: express.Response) => {
    return res.send(generateHTML(await import('../build/swagger.json')));
  }
);

RegisterRoutes(app);
