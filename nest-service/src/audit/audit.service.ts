import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async saveActivity(data: CreateAuditDto) {
    try {
      return await this.prisma.activityLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          timestamp: new Date(data.timestamp),
          metadata: data.metadata ?? {},
        },
      });
    } catch (err) {
      console.error('Failed inside saveActivity:', err);
      throw err; // optional: rethrow or swallow
    }
  }
}
