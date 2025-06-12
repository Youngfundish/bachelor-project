import { Controller, Post, Body, Get, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { SolutionService } from './solution.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';
import { UpdateSolutionDto } from './dto/updateSolution.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { Solution } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('solutions')
@Controller('solutions')
export class SolutionController {
  constructor(private readonly solutionService: SolutionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new solution' })
  @ApiBody({ type: SolutionCreateInput })
  @ApiResponse({ status: 201, description: 'Solution created successfully'})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() data: SolutionCreateInput): Promise<Solution> {
    return this.solutionService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all solutions' })
  @ApiResponse({ status: 200, description: 'List of solutions'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(): Promise<Solution[]> {
    return this.solutionService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search solutions by query' })
  @ApiQuery({ name: 'q', required: true, description: 'Search term to filter solutions' })
  @ApiResponse({ status: 200, description: 'Search results'})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async search(@Query('q') q: string): Promise<Solution[]> {
    return this.solutionService.searchSolutions(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a solution by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the solution' })
  @ApiResponse({ status: 200, description: 'Solution found'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solution not found' })
  findOne(@Param('id') id: string): Promise<Solution> {
    return this.solutionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing solution' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the solution to update' })
  @ApiBody({ type: UpdateSolutionDto })
  @ApiResponse({ status: 200, description: 'Solution updated successfully'})
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solution not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSolutionDto
  ): Promise<Solution> {
    return this.solutionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a solution by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the solution to delete' })
  @ApiResponse({ status: 200, description: 'Solution deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Solution not found' })
  delete(@Param('id') id: string): Promise<Solution> {
    return this.solutionService.delete(id);
  }
}
