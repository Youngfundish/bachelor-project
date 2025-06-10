import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuditAnalysisService } from './analysis.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('analysis')
@Controller('analysis')
export class AuditAnalysisController {
  constructor(private readonly auditAnalysisService: AuditAnalysisService) {}

  @Get('login-summary')
  async getLoginSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditAnalysisService.getLoginAnalysis({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('solution-summary')
  async getSolutionSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.auditAnalysisService.getSolutionAnalysis({
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('user-activity/:userId')
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('days') days: number = 30,
  ) {
    return this.auditAnalysisService.getUserActivity(userId, days);
  }

  @Get('daily-stats')
  async getDailyStats(
    @Query('days') days: string = '30',
  ) {
    return this.auditAnalysisService.getDailyStats(parseInt(days));
  }

  @Get('top-creators')
  async getTopSolutionCreators(
    @Query('limit') limit: string = '10',
    @Query('days') days: string = '30',
  ) {
    return this.auditAnalysisService.getTopSolutionCreators(parseInt(limit), parseInt(days));
  }

  @Get('login-patterns')
  async getLoginPatterns(
    @Query('days') days: string = '7',
  ) {
    return this.auditAnalysisService.getLoginPatterns(parseInt(days));
  }

  @Get('overview')
  async getOverview() {
    return this.auditAnalysisService.getOverallStats();
  }
}