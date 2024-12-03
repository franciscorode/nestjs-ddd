import { DomainEvent } from '../shared/domain/event.entity';

export class UserCreated extends DomainEvent {
  name: string;
  uuid: string;

  constructor({ name, uuid }: { name: string; uuid: string }) {
    super();
    this.name = name;
    this.uuid = uuid;
  }
}
