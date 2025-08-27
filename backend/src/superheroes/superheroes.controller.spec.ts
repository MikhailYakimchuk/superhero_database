import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockSuperhero = {
  _id: '64b8f0c8e4d3b2a1f0a12345',
  nickname: 'Superman',
  real_name: 'Clark Kent',
  images: ['https://example.com/superman.jpg'],
};

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('SuperheroesController', () => {
  let controller: SuperheroesController;
  let service: SuperheroesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperheroesController],
      providers: [
        { provide: SuperheroesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<SuperheroesController>(SuperheroesController);
    service = module.get<SuperheroesService>(SuperheroesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a superhero', async () => {
      mockService.create.mockResolvedValue(mockSuperhero);
      const result = await controller.create(mockSuperhero as any);
      expect(result).toEqual(mockSuperhero);
      expect(mockService.create).toHaveBeenCalledWith(mockSuperhero);
    });
  });

  describe('create errors', () => {
    it('should throw error if service.create fails', async () => {
      mockService.create.mockRejectedValue(new Error('Create failed'));
      await expect(controller.create(mockSuperhero as any)).rejects.toThrow('Create failed');
    });
  });

  describe('findAll errors', () => {
    it('should throw error if service.findAll fails', async () => {
      mockService.findAll.mockRejectedValue(new Error('FindAll failed'));
      await expect(controller.findAll(1, 5)).rejects.toThrow('FindAll failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated superheroes', async () => {
      const paginated = { data: [mockSuperhero], total: 1, page: 1, limit: 5 };
      mockService.findAll.mockResolvedValue(paginated);

      const result = await controller.findAll(1, 5);
      expect(result).toEqual(paginated);
      expect(mockService.findAll).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('findOne', () => {
    it('should return a superhero by id', async () => {
      mockService.findOne.mockResolvedValue(mockSuperhero);
      const result = await controller.findOne(mockSuperhero._id);
      expect(result).toEqual(mockSuperhero);
      expect(mockService.findOne).toHaveBeenCalledWith(mockSuperhero._id);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne(mockSuperhero._id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a superhero', async () => {
      mockService.update.mockResolvedValue(mockSuperhero);
      const result = await controller.update(mockSuperhero._id, { nickname: 'Batman' } as any);
      expect(result).toEqual(mockSuperhero);
      expect(mockService.update).toHaveBeenCalledWith(mockSuperhero._id, { nickname: 'Batman' });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      mockService.update.mockRejectedValue(new BadRequestException());
      await expect(controller.update('invalid-id', {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a superhero', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await expect(controller.remove(mockSuperhero._id)).resolves.toBeUndefined();
      expect(mockService.remove).toHaveBeenCalledWith(mockSuperhero._id);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove(mockSuperhero._id)).rejects.toThrow(NotFoundException);
    });
  });
});
