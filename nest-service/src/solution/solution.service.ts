import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';

@Injectable()
export class SolutionService {
  constructor(private prisma: PrismaService) {}

  async create(data: SolutionCreateInput) {
    return await this.prisma.solution.create({ data });
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
