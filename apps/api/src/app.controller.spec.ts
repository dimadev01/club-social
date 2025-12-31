import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/database/prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: jest.Mocked<AppService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    appService = createMock<AppService>();
    appService.getHello.mockReturnValue('Hello World!');
    appService.seed.mockResolvedValue(undefined);
    prismaService = createMock<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
        { provide: PrismaService, useValue: prismaService },
      ],
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
