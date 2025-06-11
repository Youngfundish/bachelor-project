// src/solution/dto/updateSolution.dto.ts
import { PartialType } from '@nestjs/swagger';
import { SolutionCreateInput } from './solutiuonCreationInput.model';

export class UpdateSolutionDto extends PartialType(SolutionCreateInput) {}
