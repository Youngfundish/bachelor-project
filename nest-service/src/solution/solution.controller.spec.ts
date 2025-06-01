import { Test, TestingModule } from '@nestjs/testing';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { SolutionCreateInput } from './dto/solutiuonCreationInput.model';

describe('SolutionController', () => {
  let controller: SolutionController;
  let service: SolutionService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionController],
      providers: [
        {
          provide: SolutionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SolutionController>(SolutionController);
    service = module.get<SolutionService>(SolutionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create and return a solution', async () => {
      const dto: SolutionCreateInput = {
        name: 'Test Solution',
        description: 'Desc',
        kind: 'simpleSolution',
        location: 'Copenhagen',
        mode: 'createFromNew',
        status: 'draft',
        defaultSectionId: 'section-id',
        defaultSectionName: 'Section Name',
        defaultSubSectionId: 'sub-id',
        defaultSubSectionName: 'Subsection',
        defaultEventId: 'event-id',
        defaultEventName: 'Event',
        content: 'Some content',
        problem: 'Problem desc',
        title: 'Problem title',
        email: 'test@example.com',
        solutionDetails: {
          title: 'Solution title',
          description: 'Solution description',
          rootCause: 'Root cause',
          countermeasure: 'Countermeasure',
        },
      };

      const expected = { id: '123', ...dto };
      mockService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all solutions', async () => {
      const mockSolutions = [{ id: '1' }, { id: '2' }];
      mockService.findAll.mockResolvedValue(mockSolutions);

      const result = await controller.findAll();
      expect(result).toEqual(mockSolutions);
    });
  });

  describe('findOne', () => {
    it('should return a single solution by ID', async () => {
      const id = 'abc123';
      const mockSolution = { id, name: 'Solution' };
      mockService.findOne.mockResolvedValue(mockSolution);

      const result = await controller.findOne(id);
      expect(result).toEqual(mockSolution);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should delete a solution by ID', async () => {
      const id = 'abc123';
      const mockResult = { id, deleted: true };
      mockService.delete.mockResolvedValue(mockResult);

      const result = await controller.delete(id);
      expect(result).toEqual(mockResult);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });
});
