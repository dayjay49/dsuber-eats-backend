import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "src/jwt/jwt.service";
import { UserService } from "src/users/users.service";
import { AllowedRoles } from "./role.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
  // if returns true, continue with request
  // if returns false, stop the request
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    // if no metadata, our resolver is public so continue with request
    if (!roles) {
      return true;
    }
    // this HTTP context is different from our GraphQL context
    // line of code below converts the executioncontext of nestjs into gql context
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        // using the id decoded from the token, look for the corresponding user
        const { user } = await this.userService.findById(decoded['id']);
        if (!user) {
          // when there is metadata set but NO user... so stop the request
          return false;
        }
        gqlContext['user'] = user;
        if (roles.includes('Any')) {
          // when there is user and any type of user is allowed for the resolver
          return true;
        }
        return roles.includes(user.role);
      } else {
        // when there is a problem with the decoded token
        return false;
      }
    } else {
      // when there is no token
      return false;
    }
  }
}