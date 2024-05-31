import { IsNotEmpty, IsString } from 'class-validator';

export class UniqueIDEntityNewV {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  protected constructor(props: UniqueIDEntityNewV) {
    this._id = props._id;
  }
}
