import { Test, TestingModule } from '@nestjs/testing';
import { StandaloneDataController } from './standalone-data.controller';

describe('StandaloneDataController', () => {
  let controller: StandaloneDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StandaloneDataController],
    }).compile();

    controller = module.get<StandaloneDataController>(StandaloneDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
