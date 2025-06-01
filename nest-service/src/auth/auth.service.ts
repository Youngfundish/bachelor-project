import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async register(dto: CreateUserDto) {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      let role: Role = Role.USER;

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          name: dto.name,
          role: role
        },
      });

      const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return this.signToken(payload);
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      const passwordMatch = user && await bcrypt.compare(dto.password, user.password);

      if (!user || !passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      this.eventEmitter.emit('audit.activity', {
        userId: user.id,
        action: 'user.login',
        timestamp: new Date(),
      });
  
      const payload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return this.signToken(payload);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }

  private signToken(user: any) {
    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'USER',
      },
      {
        expiresIn: '15m', // access token 15 mins
      }
    );
  
    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
      },
      {
        secret: process.env.REFRESH_TOKEN_SECRET, // use different secret!
        expiresIn: '7d', // refresh token 7 days
      }
    );
  
    return { access_token, refresh_token };
  }
}
