import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { AuditService } from './audit.service';

@Injectable()
export class AuditConsumer {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent('audit.activity')
  async handleAuditEvent(payload: any) {
    console.log('Audit event received:', payload);

    await this.auditService.saveActivity(payload);
  }
}
