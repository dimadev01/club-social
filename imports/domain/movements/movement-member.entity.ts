import { IsString } from 'class-validator';

export class MovementMember {
  @IsString()
  public _id: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  public constructor() {
    this._id = '';

    this.firstName = '';

    this.lastName = '';
  }
}
