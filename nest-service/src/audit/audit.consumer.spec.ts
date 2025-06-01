import { AuditConsumer } from './audit.consumer';
import { AuditService } from './audit.service';

describe('AuditConsumer', () => {
  let auditConsumer: AuditConsumer;
  let auditService: AuditService;

  beforeEach(() => {
    auditService = {
      saveActivity: jest.fn(),
    } as any;

    auditConsumer = new AuditConsumer(auditService);
  });

  it('should handle audit event and call saveActivity', async () => {
    const payload = {
      userId: 'user123',
      action: 'user.login',
      timestamp: new Date(),
    };

    await auditConsumer.handleAuditEvent(payload);

    expect(auditService.saveActivity).toHaveBeenCalledWith(payload);
  });
});
