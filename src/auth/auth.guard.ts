import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    // this HTTP context is different from our GraphQL context
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext.user;
    if (!user) {
      return false;
    }
    return true;
  }
}