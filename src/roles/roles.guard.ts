import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/schemas/schemas-users';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtenez les rôles requis pour cette route depuis les métadonnées
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle requis n'est défini, autorisez l'accès à la ressource
    if (!requiredRoles) {
      return true;
    }

    // Récupérer la requête HTTP
    const request = context.switchToHttp().getRequest();
    
    // Vérifier si l'en-tête Authorization est présent dans la requête
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extraire le token JWT de l'en-tête Authorization
    const [bearer, token] = request.headers.authorization.split(' ');

    // Vérifier si le format du token est correct
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      // Vérifier et décoder le token JWT
      const decoded = await this.jwtService.verifyAsync(token);
      console.log(decoded);
      
      // Vérifier si les rôles de l'utilisateur sont inclus dans le token
      if (!decoded.roles || decoded.roles.length === 0) {
        throw new UnauthorizedException('User roles are missing in token');
      }

      // Vérifier si l'utilisateur possède les rôles requis
      const hasRequiredRole = requiredRoles.some(role => decoded.roles.includes(role));
      
      if (!hasRequiredRole) {
        throw new UnauthorizedException('User does not have required role');
      }

      // Autoriser l'accès à la ressource
      return true;
    } catch (error) {
      // Gérer les erreurs de décodage ou d'autorisation du token JWT
      throw new UnauthorizedException('Invalid token or unauthorized access');
    }
  }
}
