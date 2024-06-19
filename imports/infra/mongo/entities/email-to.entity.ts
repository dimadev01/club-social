import { IsEmail, IsLowercase, IsNotEmpty, IsString } from 'class-validator';

export class EmailToEntity {
  @IsEmail()
  @IsLowercase()
  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  constructor(props: EmailToEntity) {
    this.email = props.email;

    this.name = props.name;
  }
}
