import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesService } from './superheroes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Superhero } from './entities/superhero.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockSuperhero = {
  _id: '64b8f0c8e4d3b2a1f0a12345',
  nickname: 'Superman',
  real_name: 'Clark Kent',
  images: ['https://example.com/superman.jpg'],
};

describe('SuperheroesService', () => {
  let service: SuperheroesService;
  let mockSuperheroModel: any;

  beforeEach(async () => {
    // Мок конструктора Mongoose
    mockSuperheroModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ _id: mockSuperhero._id, ...dto }),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuperheroesService,
        { provide: getModelToken(Superhero.name), useValue: mockSuperheroModel },
      ],
    }).compile();

    service = module.get<SuperheroesService>(SuperheroesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a superhero', async () => {
      const result = await service.create(mockSuperhero as any);
      expect(result).toEqual(expect.objectContaining(mockSuperhero));
      expect(mockSuperheroModel).toHaveBeenCalledWith(mockSuperhero);
    });
  });

  describe('findAll', () => {
    it('should return paginated superheroes', async () => {
      const mockChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockSuperhero]),
      };
      mockSuperheroModel.find = jest.fn().mockReturnValue(mockChain);
      mockSuperheroModel.countDocuments = jest.fn().mockResolvedValue(1);

      const result = await service.findAll(1, 5);
      expect(result).toEqual({
        data: [{ id: mockSuperhero._id, nickname: mockSuperhero.nickname, image: mockSuperhero.images[0] }],
        total: 1,
        page: 1,
        limit: 5,
      });
    });
  });

  describe('findOne', () => {
    it('should return a superhero by id', async () => {
      mockSuperheroModel.findById = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockSuperhero) });
      const result = await service.findOne(mockSuperhero._id);
      expect(result).toEqual(mockSuperhero);
    });

    it('should throw NotFoundException if superhero not found', async () => {
      mockSuperheroModel.findById = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      await expect(service.findOne(mockSuperhero._id)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a superhero', async () => {
      mockSuperheroModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSuperhero);
      const result = await service.update(mockSuperhero._id, { nickname: 'Batman' } as any);
      expect(result).toEqual(mockSuperhero);
    });

    it('should throw NotFoundException if superhero not found', async () => {
      mockSuperheroModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await expect(service.update(mockSuperhero._id, { nickname: 'Batman' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.update('invalid-id', {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a superhero', async () => {
      mockSuperheroModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockSuperhero);
      await expect(service.remove(mockSuperhero._id)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if superhero not found', async () => {
      mockSuperheroModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      await expect(service.remove(mockSuperhero._id)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });
});
