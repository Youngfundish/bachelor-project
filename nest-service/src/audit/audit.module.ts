import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditConsumer } from './audit.consumer';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
imports: [PrismaModule],
  providers: [AuditService, AuditConsumer],
  exports: [AuditService],
})
export class AuditModule {}
