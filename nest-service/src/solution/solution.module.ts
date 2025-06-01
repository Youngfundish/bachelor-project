import { Module } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SolutionController } from './solution.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SolutionController],
  providers: [SolutionService],
})
export class SolutionModule {}
