import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SolutionService {
  constructor(private prisma: PrismaService, private readonly eventEmitter: EventEmitter2) {}

  async create(data: SolutionCreateInput) {
    const res = await this.prisma.solution.create({ data });
    this.eventEmitter.emit('audit.activity', {
      userId: data.email,
      action: 'solution.creation',
      timestamp: new Date(),
    });
    return res
  }

  findAll() {
    return this.prisma.solution.findMany({
      include: {
        solutionDetails: true,  // Include the related SolutionDetails model
      },
    });
  }

  findOne(id: string) {
    return this.prisma.solution.findUnique({ where: { id } });
  }

  delete(id: string) {
    return this.prisma.solution.delete({ where: { id } });
  }
}
