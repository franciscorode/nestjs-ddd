import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientOptions, Transport } from '@nestjs/microservices';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQConfigurer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private exchangeName: string;
  private retryExchangeName: string;
  private deadLetterExchangeName: string;
  private commonRetryExchangeName: string;
  private commonDeadLetterExchangeName: string;
  private connectionName: string;

  constructor(organization: string, service: string) {
    this.connectToRabbitMQ();
    this.exchangeName = `${organization}.${service}`;
    this.retryExchangeName = `retry.${this.exchangeName}`;
    this.deadLetterExchangeName = `dead_letter.${this.exchangeName}`;
    this.commonRetryExchangeName = `retry.${organization}.store`;
    this.commonDeadLetterExchangeName = `dead_letter.${organization}.store`;
    this.connectionName = `connection-configurer-${this.exchangeName}`;
  }

  private async connectToRabbitMQ() {
    this.connection = await amqp.connect('amqp://localhost:5672');
    this.channel = await this.connection.createChannel();

    // configure exchanges
    await this.channel.assertExchange(this.exchangeName, 'topic', {
      durable: true,
    });

    await this.channel.assertExchange(this.retryExchangeName, 'topic', {
      durable: true,
    });

    await this.channel.assertExchange(this.deadLetterExchangeName, 'topic', {
      durable: true,
    });

    await this.channel.assertExchange(this.commonRetryExchangeName, 'topic', {
      durable: true,
    });

    await this.channel.assertExchange(
      this.commonDeadLetterExchangeName,
      'topic',
      {
        durable: true,
      },
    );

    // declare queues
    await this.channel.assertQueue(this.exchangeName, { durable: true });
    // see https://github.com/franciscorode/asyncio_ddd/blob/main/asyncio_ddd/shared/infrastructure/buses/event/rabbitmq/rabbitmq_configurer.py

    // await channel.close()
    // await connection.close()

    // // Declare your exchange (direct, topic, etc.)
    // await this.channel.assertExchange('my_exchange', 'direct', {
    //   durable: true,
    // });

    // // Declare a queue that will receive messages from the exchange
    // await this.channel.assertQueue('my_queue', { durable: true });

    // // Bind the queue to the exchange with a routing key
    // await this.channel.bindQueue('my_queue', 'my_exchange', 'my_routing_key');
  }

  // Custom method to publish messages to the exchange
  async publishToExchange(routingKey: string, message: any) {
    this.channel.publish(
      'my_exchange', // Exchange name
      routingKey, // Routing key
      Buffer.from(JSON.stringify(message)), // Message
    );
  }

  // Close the connection and channel when done
  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }
}
