import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'فرمت ایمیل وارد شده معتبر نیست.' })
  @IsNotEmpty({ message: 'ایمیل الزامی است.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'رمز عبور الزامی است.' })
  @MinLength(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' })
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'توکن بازیابی الزامی است.' })
  refreshToken!: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'نام الزامی است.' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'نام خانوادگی الزامی است.' })
  lastName!: string;

  @IsEmail({}, { message: 'فرمت ایمیل معتبر نیست.' })
  @IsNotEmpty({ message: 'ایمیل الزامی است.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'رمز عبور الزامی است.' })
  @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد.' })
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  roleName?: string;
}
