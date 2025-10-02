import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '$2b$10$rQZ8K9vX7wE2tY3uI4oP5e', required: false })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({ example: '/profiles/john-doe.jpg', required: false })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiProperty({ example: 'Passionate about community service', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: '100 Market St', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'San Francisco', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'CA', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '94105', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  @IsEnum(['user', 'org_admin', 'super_admin'])
  role?: string;
}
