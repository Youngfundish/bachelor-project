import { Controller, Post, Body, Get, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { SolutionService } from './solution.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Solution } from '@prisma/client';
import { UpdateSolutionDto } from './dto/updateSolution.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()     
@ApiTags('solutions')
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

  @Get('search')
  async search(@Query('q') q: string): Promise<Solution[]> {
    return this.solutionService.searchSolutions(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solutionService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSolutionDto
  ): Promise<Solution> {
    return this.solutionService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.solutionService.delete(id);
  }
}
