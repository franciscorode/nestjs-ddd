import { Inject } from '@nestjs/common';

import { DomainEventBus } from '../domain/domain-event.bus';
import { DomainEvent } from '../domain/event.entity';
import { ClientProxy } from '@nestjs/microservices';

export class RabbitMqDomainEventBus implements DomainEventBus {
  constructor(@Inject('EVENT_BUS') private readonly client: ClientProxy) {}
  async publish(event: DomainEvent): Promise<void> {
    this.client.emit('event_name', event);
  }
}
