import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    appService = createMock<AppService>();
    appService.getHello.mockReturnValue('Hello World!');
    appService.seed.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appService }],
    }).compile();

    appController = module.get(AppController);
  });

  describe('getHello', () => {
    it('returns "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });

  describe('getError', () => {
    it('throws', () => {
      expect(() => appController.getError()).toThrow();
    });
  });

  describe('seed', () => {
    it('calls service seed', async () => {
      await appController.seed();
      expect(appService.seed).toHaveBeenCalled();
    });
  });
});
