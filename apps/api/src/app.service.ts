import {
  FileStatus,
  MaritalStatus,
  MemberCategory,
  MemberNationality,
  MemberSex,
} from '@club-social/shared/members';
import { UserRole } from '@club-social/shared/users';
import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { sample, times } from 'es-toolkit/compat';

import { BetterAuthService } from './infrastructure/auth/better-auth/better-auth.service';
import { ConfigService } from './infrastructure/config/config.service';
import { CreateMemberUseCase } from './members/application/create-member/create-member.use-case';
import { Address } from './shared/domain/value-objects/address/address.vo';
import { PublicRoute } from './shared/presentation/decorators/public-route.decorator';
import { CreateUserUseCase } from './users/application/create-user/create-user.use-case';
import {
  USER_REPOSITORY_PROVIDER,
  type UserRepository,
} from './users/domain/user.repository';

@Injectable()
export class AppService {
  public constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
    private readonly betterAuth: BetterAuthService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  @PublicRoute()
  public async seed(): Promise<void> {
    const { total } = await this.userRepository.findPaginated({
      filters: {},
      page: 1,
      pageSize: 1,
      sort: [],
    });

    if (total > 0) {
      return;
    }

    await Promise.all([
      this.createUserUseCase.execute({
        createdBy: 'System',
        email: this.configService.adminUserEmail,
        firstName: 'Admin',
        lastName: 'Club Social',
        role: UserRole.ADMIN,
      }),
      this.createUserUseCase.execute({
        createdBy: 'System',
        email: 'staff@clubsocialmontegrande.ar',
        firstName: 'Staff',
        lastName: 'Club Social',
        role: UserRole.STAFF,
      }),
      ...times(135, () =>
        this.createMemberUseCase.execute({
          address: sample([
            null,
            Address.raw({
              cityName: sample([null, faker.location.city()]),
              stateName: sample([null, faker.location.state()]),
              street: sample([null, faker.location.street()]),
              zipCode: sample([null, faker.location.zipCode()]),
            }),
          ]),
          birthDate: sample([
            null,
            faker.date.birthdate().toISOString().split('T')[0],
          ]),
          category: sample([
            MemberCategory.MEMBER,
            MemberCategory.ADHERENT_MEMBER,
            MemberCategory.CADET,
            MemberCategory.PRE_CADET,
          ]),
          createdBy: 'System',
          documentID: sample([null, faker.string.uuid()]),
          email: faker.internet.email(),
          fileStatus: sample([FileStatus.COMPLETED, FileStatus.PENDING]),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          maritalStatus: sample([
            null,
            MaritalStatus.SINGLE,
            MaritalStatus.MARRIED,
            MaritalStatus.DIVORCED,
            MaritalStatus.WIDOWED,
          ]),
          nationality: sample([
            null,
            MemberNationality.ARGENTINA,
            MemberNationality.BULGARIA,
            MemberNationality.COLOMBIA,
            MemberNationality.UKRAINE,
          ]),
          phones: sample([
            [],
            [faker.phone.number()],
            [faker.phone.number(), faker.phone.number()],
          ]),
          sex: sample([null, MemberSex.MALE, MemberSex.FEMALE]),
        }),
      ),
    ]);
  }
}
