import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('solutions')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post()
  create(@Body() data: SolutionCreateInput) {
    return this.solutionService.create(data);
  }

  @Get()
  findAll() {
    return this.solutionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.solutionService.delete(id);
  }
}
