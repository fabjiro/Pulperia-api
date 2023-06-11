import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProfileService } from '../../../profile/profile.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  @Inject()
  private readonly profileService: ProfileService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const userDB = await this.profileService.findOne(user.id);
    const isAdmin = roles.includes(userDB.rol.name);

    if (!isAdmin || !user)
      throw new HttpException('No tienes permisos de administrador', 403);

    return true;
  }
}
