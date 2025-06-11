import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Solution } from '@prisma/client';
import { UpdateSolutionDto } from './dto/updateSolution.dto';

interface AtlasSearchResult {
  cursor: {
    firstBatch: Solution[];
  };
}

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

  async searchSolutions(query: string): Promise<Solution[]> {
    const pipeline = [
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: ['name', 'description', 'problem']
          }
        }
      },
      { $limit: 20 },
    ];

    const raw = (await this.prisma.$runCommandRaw({
      aggregate: 'solutions',
      pipeline,
      cursor: {},
    })) as unknown as AtlasSearchResult;
    console.log(raw)

    return raw.cursor.firstBatch;
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

  async update(id: string, data: UpdateSolutionDto): Promise<Solution> {
    const existing = await this.prisma.solution.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Solution with id ${id} not found`);
    }

    const updated = await this.prisma.solution.update({
      where: { id },
      data,
    });

    this.eventEmitter.emit('audit.activity', {
      userId: updated.email,
      action: 'solution.update',
      timestamp: new Date(),
      metaData: { solutionId: id },
    });

    return updated;
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
