import { DomainEvent } from './event.entity';

export interface DomainEventBus {
  publish(event: DomainEvent): Promise<void>;
}
