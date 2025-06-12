import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

@ApiTags('analysis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly auditAnalysisService: AnalysisService) {}

  @Get('login-summary')
  @ApiOperation({ summary: 'Get login summary within optional date range' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date in ISO format' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date in ISO format' })
  @ApiResponse({ status: 200, description: 'Login summary data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Get solution summary within optional date range' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date in ISO format' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date in ISO format' })
  @ApiResponse({ status: 200, description: 'Solution summary data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Get user activity over a number of days' })
  @ApiParam({ name: 'userId', description: 'The user ID to retrieve activity for' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 30)' })
  @ApiResponse({ status: 200, description: 'User activity data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('days') days: number = 30,
  ) {
    return this.auditAnalysisService.getUserActivity(userId, days);
  }

  @Get('daily-stats')
  @ApiOperation({ summary: 'Get daily stats for a number of days' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 30)' })
  @ApiResponse({ status: 200, description: 'Daily statistics data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDailyStats(
    @Query('days') days: string = '30',
  ) {
    return this.auditAnalysisService.getDailyStats(parseInt(days));
  }

  @Get('top-creators')
  @ApiOperation({ summary: 'Get top solution creators in a period' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of creators to return (default 10)' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 30)' })
  @ApiResponse({ status: 200, description: 'Top solution creators data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTopSolutionCreators(
    @Query('limit') limit: string = '10',
    @Query('days') days: string = '30',
  ) {
    return this.auditAnalysisService.getTopSolutionCreators(
      parseInt(limit),
      parseInt(days),
    );
  }

  @Get('login-patterns')
  @ApiOperation({ summary: 'Get login patterns over a number of days' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back (default 7)' })
  @ApiResponse({ status: 200, description: 'Login patterns data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoginPatterns(
    @Query('days') days: string = '7',
  ) {
    return this.auditAnalysisService.getLoginPatterns(parseInt(days));
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overall analysis overview' })
  @ApiResponse({ status: 200, description: 'Overall statistics data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOverview() {
    return this.auditAnalysisService.getOverallStats();
  }
}
