import { Module } from '@nestjs/common';
import { AuditAnalysisController } from './analysis.controller';
import { AuditAnalysisService } from './analysis.service';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path as needed

@Module({
  controllers: [AuditAnalysisController],
  providers: [AuditAnalysisService, PrismaService],
  exports: [AuditAnalysisService],
})
export class AuditAnalysisModule {}
