import { Controller, Post, Body, HttpException, HttpStatus, InternalServerErrorException, UnauthorizedException, Res, UsePipes, HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { LoginDto, loginSchema } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService: JwtService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.authService.register(createUserDto);
      if (!user) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      return { message: 'User created successfully', user };
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Register failed:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'Returns an access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,) {
    try {
      const token = await this.authService.login(loginDto);
      if (!token) {
        throw new UnauthorizedException('Invalid credentials');
      }
      response.cookie('accessToken', token.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000, 
      });

      response.cookie('refreshToken', token.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      console.error('Login failed:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }
  @Post('refresh')
async refresh(@Body() body: { refreshToken?: string }, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // First try body refreshToken
    let refreshToken = body.refreshToken;

    // Fallback to cookie (optional)
    if (!refreshToken) {
        refreshToken = (req as any).cookies?.refreshToken;
    }

    if (!refreshToken) {
        throw new UnauthorizedException('No refresh token provided');
    }

    try {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.REFRESH_TOKEN_SECRET,
        });

        const user = await this.authService.findUserById(payload.userId);

        const newTokens = this.authService.signToken(user);

        // Optionally update cookies again
        res.cookie('accessToken', newTokens.access_token, {
            httpOnly: true,
            secure: false, // set true in production
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refreshToken', newTokens.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Return tokens so client can update them if needed
        return {
            access_token: newTokens.access_token,
            refresh_token: newTokens.refresh_token,
        };
    } catch (error) {
        console.error('Refresh token error:', error);
        throw new UnauthorizedException('Invalid refresh token');
    }
}
}
