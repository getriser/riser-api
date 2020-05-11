import { NextFunction, Request, Response } from 'express';
import { Controller } from '../decorators/Controller';
import { Get } from '../decorators/Get';
import { RequireUser } from '../decorators/RequireUser';

@Controller('/groups')
export default class GroupsController {
  @Get('/')
  public index(request: Request, response: Response, next: NextFunction) {
    return response.send({ hello: 'there' });
  }

  @Get('/:id')
  @RequireUser()
  public get(request: Request, response: Response, next: NextFunction) {
    return response.send({ ok: 'pal' });
  }
}
