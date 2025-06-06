import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 🔐 Replace with env variable in production
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports:[JwtModule, PassportModule]
})
export class AuthModule {}
