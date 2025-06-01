import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register and return a user with token', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'USER'
      };

      const mockTokens = {
        access_token: 'mocked-access-token',
        refresh_token: 'mocked-refresh-token',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockTokens);

      const result = await controller.register(dto);
      expect(result).toEqual({
        message: 'User created successfully',
        user: mockTokens,
      });
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should return success message and set cookie on valid credentials', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
  
      const mockTokens = {
        access_token: 'mocked-access-token',
        refresh_token: 'mocked-refresh-token',
      };
  
      // Mock the service
      jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);
  
      // Mock response
      const response = {
        cookie: jest.fn(),
      } as any;
  
      // Call controller
      const result = await controller.login(dto, response);
  
      // Assert returned message
      expect(result.message).toEqual('Login successful');
  
      // Assert service was called
      expect(authService.login).toHaveBeenCalledWith(dto);
  
      // Assert cookie was set
      expect(response.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.access_token,
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          path: '/',
          maxAge: 15 * 60,
        })
      );
    });
  });  
});
