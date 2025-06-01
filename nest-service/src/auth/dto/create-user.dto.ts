import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { z } from 'zod'

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ default: 'USER' })
  @IsString()
  role: string;
}

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(2, { message: "First name must be at least 2 characters" }),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
