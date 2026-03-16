import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  role: string;
  schoolId: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? 'secret',
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.role || !payload.schoolId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return {
      userId: payload.sub,
      role: payload.role,
      schoolId: payload.schoolId,
      email: payload.email,
    };
  }
}
