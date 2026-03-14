import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT guard — attaches req.user if a valid token is present,
 * but does NOT throw 401 when there is no token or an invalid one.
 * Use on routes that are public but can credit bonus points to logged-in users.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(_err: unknown, user: TUser): TUser {
    return user; // null when unauthenticated — that's fine
  }
}
