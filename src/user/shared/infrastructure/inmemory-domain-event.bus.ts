import { DomainEventBus } from '../domain/domain-event.bus';
import { DomainEvent } from '../domain/event.entity';

export class InMemoryDomainEventBus implements DomainEventBus {
  private events: DomainEvent[] = [];
  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }
}
