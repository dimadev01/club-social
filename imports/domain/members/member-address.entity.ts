import { IsOptional, IsString } from 'class-validator';

export class MemberAddress {
  @IsString()
  @IsOptional()
  public city: string | null;

  @IsString()
  @IsOptional()
  public state: string | null;

  @IsString()
  @IsOptional()
  public street: string | null;

  @IsString()
  @IsOptional()
  public zipCode: string | null;
}
