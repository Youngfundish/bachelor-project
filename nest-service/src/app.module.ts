import { Module } from '@nestjs/common';
import { SolutionModule } from './solution/solution.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuditModule } from './audit/audit.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    SolutionModule,
    PrismaModule,
    AuthModule,
    AuditModule,
    AnalysisModule
  ],
})
export class AppModule {}
