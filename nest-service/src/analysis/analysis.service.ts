import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path as needed

@Injectable()
export class AuditAnalysisService {
  constructor(private prisma: PrismaService) {}

  async getLoginAnalysis(filters: { startDate?: Date; endDate?: Date }) {
    const whereClause: any = { action: 'user.login' };
  
    if (filters.startDate && filters.endDate) {
      whereClause.timestamp = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }
  
    // Get total logins
    const totalLogins = await this.prisma.activityLog.count({ where: whereClause });
  
    // Get unique users count
    const uniqueUsersResult = await this.prisma.activityLog.groupBy({
      by: ['userId'],
      where: whereClause,
    });
    const uniqueUsers = uniqueUsersResult.length;
  
    // Get recent logins
    const recentLogins = await this.prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
  
    // Get logins by hour using raw aggregation
    const loginsByHourRaw = await this.prisma.activityLog.aggregateRaw({
      pipeline: [
        { $match: { action: 'user.login', timestamp: filters.startDate && filters.endDate ? { $gte: filters.startDate, $lte: filters.endDate } : { $exists: true } } },
        {
          $group: {
            _id: { $hour: '$timestamp' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]
    });
  
    const loginsByHour = Array.isArray(loginsByHourRaw) 
      ? loginsByHourRaw.map((item: any) => ({
          hour: item._id,
          count: item.count
        }))
      : [];
  
    return {
      totalLogins,
      uniqueUsers,
      recentLogins,
      loginsByHour
    };
  }
  
  async getSolutionAnalysis(filters: { startDate?: Date; endDate?: Date }) {
    const whereClause: any = { action: 'solution.creation' };
  
    if (filters.startDate && filters.endDate) {
      whereClause.timestamp = {
        gte: filters.startDate,
        lte: filters.endDate,
      };
    }
  
    // Get total solutions
    const totalSolutions = await this.prisma.activityLog.count({ where: whereClause });
  
    // Get unique creators count
    const uniqueCreatorsResult = await this.prisma.activityLog.groupBy({
      by: ['userId'],
      where: whereClause,
    });
    const uniqueCreators = uniqueCreatorsResult.length;
  
    // Get recent solutions
    const recentSolutions = await this.prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
  
    // Get solutions by day using raw aggregation
    const solutionsByDayRaw = await this.prisma.activityLog.aggregateRaw({
      pipeline: [
        { $match: { action: 'solution.creation', timestamp: filters.startDate && filters.endDate ? { $gte: filters.startDate, $lte: filters.endDate } : { $exists: true } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 30 }
      ]
    });
  
    const solutionsByDay = Array.isArray(solutionsByDayRaw) 
      ? solutionsByDayRaw.map((item: any) => ({
          date: item._id,
          count: item.count
        }))
      : [];
  
    return {
      totalSolutions,
      uniqueCreators,
      recentSolutions,
      solutionsByDay
    };
  }
  
  async getUserActivity(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    const activities = await this.prisma.activityLog.findMany({
      where: {
        userId,
        timestamp: { gt: startDate }
      },
      orderBy: { timestamp: 'desc' },
    });
  
    const loginCount = activities.filter(a => a.action === 'user.login').length;
    const solutionCount = activities.filter(a => a.action === 'solution.creation').length;
  
    // Simple grouping by date and action
    const activityMap = new Map<string, Map<string, number>>();
    
    activities.forEach(activity => {
      const dateStr = activity.timestamp.toISOString().split('T')[0];
      if (!activityMap.has(dateStr)) {
        activityMap.set(dateStr, new Map());
      }
      const dayMap = activityMap.get(dateStr)!;
      dayMap.set(activity.action, (dayMap.get(activity.action) || 0) + 1);
    });
  
    const activityByDay = Array.from(activityMap.entries()).map(([date, actionMap]) => {
      return Array.from(actionMap.entries()).map(([action, count]) => ({
        date,
        action,
        count
      }));
    }).flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
    return {
      userId,
      period: `${days} days`,
      summary: {
        totalLogins: loginCount,
        totalSolutions: solutionCount,
        totalActivities: activities.length,
      },
      recentActivities: activities.slice(0, 20),
      activityByDay
    };
  }
  
  async getDailyStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    const activities = await this.prisma.activityLog.findMany({
      where: {
        timestamp: { gt: startDate }
      },
      select: {
        timestamp: true,
        action: true,
        userId: true
      }
    });
  
    // Group by date
    const statsByDate = new Map<string, {
      date: string;
      logins: number;
      solutions: number;
      uniqueUsers: Set<string>;
    }>();
  
    activities.forEach(activity => {
      const dateStr = activity.timestamp.toISOString().split('T')[0];
      
      if (!statsByDate.has(dateStr)) {
        statsByDate.set(dateStr, {
          date: dateStr,
          logins: 0,
          solutions: 0,
          uniqueUsers: new Set()
        });
      }
  
      const dayStats = statsByDate.get(dateStr)!;
      dayStats.uniqueUsers.add(activity.userId);
  
      if (activity.action === 'user.login') {
        dayStats.logins++;
      } else if (activity.action === 'solution.creation') {
        dayStats.solutions++;
      }
    });
  
    return Array.from(statsByDate.values())
      .map(stats => ({
        date: stats.date,
        logins: stats.logins,
        solutions: stats.solutions,
        uniqueUsers: stats.uniqueUsers.size
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getTopSolutionCreators(limit: number = 10, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    const solutionCreators = await this.prisma.activityLog.groupBy({
      by: ['userId'],
      where: {
        action: 'solution.creation',
        timestamp: { gt: startDate }
      },
      _count: {
        userId: true
      },
      orderBy: {
        _count: {
          userId: 'desc'
        }
      },
      take: limit
    });
  
    return solutionCreators.map(creator => ({
      userId: creator.userId,
      solutionCount: creator._count.userId
    }));
  }
  
  async getLoginPatterns(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    const logins = await this.prisma.activityLog.findMany({
      where: {
        action: 'user.login',
        timestamp: { gt: startDate }
      },
      select: {
        timestamp: true
      }
    });
  
    // Group by day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeekCounts = new Map<number, number>();
    const hourCounts = new Map<number, number>();
  
    logins.forEach(login => {
      const date = new Date(login.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
  
      dayOfWeekCounts.set(dayOfWeek, (dayOfWeekCounts.get(dayOfWeek) || 0) + 1);
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
  
    const loginsByDayOfWeek = Array.from(dayOfWeekCounts.entries())
      .map(([dayOfWeek, count]) => ({ dayOfWeek, count }))
      .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  
    const loginsByHour = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);
  
    return {
      loginsByDayOfWeek,
      loginsByHour
    };
  }
  
  

  async getOverallStats() {
    const [
      totalLogins,
      totalSolutions,
      uniqueUsers,
      recentActivity,
    ] = await Promise.all([
      this.prisma.activityLog.count({ where: { action: 'user.login' } }),
      this.prisma.activityLog.count({ where: { action: 'solution.creation' } }),
      this.prisma.activityLog.findMany({
        select: { userId: true },
        distinct: ['userId'],
      }),
      this.prisma.activityLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
    ]);

    // Get stats for the last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const [loginsLast24h, solutionsLast24h] = await Promise.all([
      this.prisma.activityLog.count({
        where: {
          action: 'user.login',
          timestamp: { gt: last24Hours },
        },
      }),
      this.prisma.activityLog.count({
        where: {
          action: 'solution.creation',
          timestamp: { gt: last24Hours },
        },
      }),
    ]);

    return {
      overview: {
        totalLogins,
        totalSolutions,
        totalUniqueUsers: uniqueUsers.length,
        totalActivities: totalLogins + totalSolutions,
      },
      last24Hours: {
        logins: loginsLast24h,
        solutions: solutionsLast24h,
        total: loginsLast24h + solutionsLast24h,
      },
      recentActivity,
    };
  }
}