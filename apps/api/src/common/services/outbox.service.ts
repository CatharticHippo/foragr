import { Injectable, Inject } from '@nestjs/common';
import { DrizzleDatabase } from '../../database/database.types';
import { outbox } from '../../database/schema';

export interface OutboxEvent {
  type: string;
  aggregateId: string;
  aggregateType: string;
  payload: Record<string, any>;
}

@Injectable()
export class OutboxService {
  constructor(
    @Inject('DB_CONNECTION')
    private db: DrizzleDatabase,
  ) {}

  async createEvent(event: OutboxEvent) {
    await this.db.insert(outbox).values({
      topic: event.type,
      payload: {
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        ...event.payload,
      },
      createdAt: new Date(),
      status: 'pending',
    });
  }
}
