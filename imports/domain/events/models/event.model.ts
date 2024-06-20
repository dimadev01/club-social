import { Result, err, ok } from 'neverthrow';

import { Model } from '@domain/common/models/model';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { CreateEvent, IEvent } from '@domain/events/event.interface';

export class Event extends Model implements IEvent {
  private _action: EventActionEnum;

  private _description: string | null;

  private _resource: EventResourceEnum;

  private _resourceId: string;

  public constructor(props?: IEvent) {
    super(props);

    this._description = props?.description ?? null;

    this._resource = props?.resource ?? EventResourceEnum.SYSTEM;

    this._resourceId = props?.resourceId ?? '';

    this._action = props?.action ?? EventActionEnum.CREATE;
  }

  public get action(): EventActionEnum {
    return this._action;
  }

  public get description(): string | null {
    return this._description;
  }

  public get resource(): EventResourceEnum {
    return this._resource;
  }

  public get resourceId(): string {
    return this._resourceId;
  }

  public static create(props: CreateEvent): Result<Event, Error> {
    const event = new Event();

    const result = Result.combine([
      event.setDescription(props.description),
      event.setResource(props.resource),
      event.setResourceId(props.resourceId),
      event.setAction(props.action),
    ]);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(event);
  }

  private setAction(action: EventActionEnum): Result<null, Error> {
    this._action = action;

    return ok(null);
  }

  private setDescription(description: string | null): Result<null, Error> {
    this._description = description;

    return ok(null);
  }

  private setResource(resource: EventResourceEnum): Result<null, Error> {
    this._resource = resource;

    return ok(null);
  }

  private setResourceId(resourceId: string): Result<null, Error> {
    this._resourceId = resourceId;

    return ok(null);
  }
}
