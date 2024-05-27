import { IsNotEmpty, IsString } from 'class-validator';

export class UniqueIDEntity {
  @IsNotEmpty()
  @IsString()
  public _id: string;

  protected constructor(props?: UniqueIDEntity) {
    if (props) {
      this._id = props._id;
    }
  }
}
