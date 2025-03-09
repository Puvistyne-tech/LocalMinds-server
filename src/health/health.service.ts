import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
    constructor(
        @InjectConnection() private readonly mongoConnection: Connection,
    ) {}

    async checkMongoDB() {
        try {
            if (this.mongoConnection.readyState === 1) {
                return {
                    mongodb: {
                        status: 'up',
                        responseTime: await this.measureMongoResponseTime(),
                    },
                };
            }
            return {
                mongodb: {
                    status: 'down',
                    error: 'Database not connected',
                },
            };
        } catch (error) {
            return {
                mongodb: {
                    status: 'down',
                    error: error.message,
                },
            };
        }
    }

    private async measureMongoResponseTime(): Promise<number> {
        const start = Date.now();
        await this.mongoConnection.db.admin().ping();
        return Date.now() - start;
    }
} 