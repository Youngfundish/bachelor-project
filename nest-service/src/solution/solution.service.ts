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
        solutionDetails: true,
      },
      where: {
        isDeleted: false
      }
    });
  }

  findOne(id: string) {
    return this.prisma.solution.findUnique({ where: {
      id,
      isDeleted: false,
    },
    include: {
      solutionDetails: true,
    },
   });
  }

  async delete(id: string) {
    const res = await this.prisma.solution.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    this.eventEmitter.emit('audit.activity', {
      userId: null,
      action: 'solution.deleted',
      timestamp: new Date(),
      metaData: {'solutionId': id}
    });
    return res;
  }
}
