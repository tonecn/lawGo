import { Test, TestingModule } from '@nestjs/testing';
import { AichatController } from './aichat.controller';

describe('AichatController', () => {
  let controller: AichatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AichatController],
    }).compile();

    controller = module.get<AichatController>(AichatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
