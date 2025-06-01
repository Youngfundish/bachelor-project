import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts token from Authorization header
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // Hardcoded for demo; use environment variable!
    });
  }

  async validate(payload: any) {
    // This is what will be attached to req.user
    return { userId: payload.sub, email: payload.email };
  }
}
