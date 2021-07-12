import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

// a way tot apply this middleware as a function:
// export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
//   console.log(req.headers);
//   next();
// }

// a way to apply this middleware as a class:
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // extract token from header if it exists
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          // using the id decoded from the token, look for the corresponding user
          const { user, ok } = await this.userService.findById(decoded['id']);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (e) {}
    }
    next();
  }
}