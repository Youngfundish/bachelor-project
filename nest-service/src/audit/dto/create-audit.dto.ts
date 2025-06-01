export class CreateAuditDto {
    userId: string;
    action: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }
  