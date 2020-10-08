import { Controller, Route, Path, Query, Get } from 'tsoa';

interface HelloResponse {
  userId: number;
  name: string;
  last: string;
}

@Route('tests')
export class TestController extends Controller {
  @Get('{userId}')
  public getHello(
    @Path() userId: number,
    @Query() name?: string,
    @Query() last?: string
  ): HelloResponse {
    return {
      userId,
      name,
      last,
    };
  }
}
