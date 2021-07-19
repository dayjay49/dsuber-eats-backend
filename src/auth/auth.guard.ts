import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { AllowedRoles } from "./role.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
  // if returns true, continue with request
  // if returns false, stop the request
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
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
    console.log(gqlContext.token);
    // if there is metadata, we expect there to be a user for our private resolver
    const user: User = gqlContext['user'];
    if (!user) {
      // when there is metadata set but NO user... so stop the request
      return false;
    }
    if (roles.includes('Any')) {
      // when there is user and any type of user is allowed for the resolver
      return true;
    }
    return roles.includes(user.role);
  }
}