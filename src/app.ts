// create express app
import * as express from 'express';
import { serve, generateHTML } from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import { RegisterRoutes } from './routes';
import { ValidateError } from 'tsoa';
import ApiError from './errors/ApiError';

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
    return res.send(generateHTML(await import('./swagger.json')));
  }
);

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof Error) {
    console.error('Internal Server Error!', err);

    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
});
