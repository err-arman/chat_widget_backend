import { IsNotEmpty, IsOptional, IsString, IsEmail, MinLength, MaxLength } from "@nestjs/class-validator";

export class CreateAdminDto {
    @IsString()
    clerk_user_id: string;
  
    @IsString()
    first_name: string;
  
    @IsString()
    last_name: string;
  
    @IsOptional()
    @IsString()
    phone_number?: string;
  
    @IsEmail()
    user_email: string;
  
    @IsOptional()
    @IsString()
    date_of_birth?: string;
  
    @IsOptional()
    @IsString()
    gender?: string;
  
    @IsOptional()
    @IsString()
    imageUrl?: string;

}
