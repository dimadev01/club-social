import { Injectable } from '@nestjs/common';

import { PrismaMappers } from '@/infrastructure/database/prisma/prisma.mappers';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MemberLedgerEntryEntity } from '../domain/member-ledger-entry.entity';
import { MemberLedgerRepository } from '../member-ledger.repository';

@Injectable()
export class PrismaMemberLedgerRepository implements MemberLedgerRepository {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mapper: PrismaMappers,
  ) {}

  public async findUniqueById(
    id: UniqueId,
  ): Promise<MemberLedgerEntryEntity | null> {
    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findUnique({
        where: { id: id.value },
      });

    return memberLedgerEntry
      ? this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry)
      : null;
  }

  public async findUniqueByIds(
    ids: UniqueId[],
  ): Promise<MemberLedgerEntryEntity[]> {
    const memberLedgerEntries =
      await this.prismaService.memberLedgerEntry.findMany({
        where: { id: { in: ids.map((id) => id.value) } },
      });

    return memberLedgerEntries.map((memberLedgerEntry) =>
      this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry),
    );
  }

  public async findUniqueOrThrow(
    id: UniqueId,
  ): Promise<MemberLedgerEntryEntity> {
    const memberLedgerEntry =
      await this.prismaService.memberLedgerEntry.findUniqueOrThrow({
        where: { id: id.value },
      });

    return this.mapper.memberLedgerEntry.toDomain(memberLedgerEntry);
  }

  public async save(entity: MemberLedgerEntryEntity): Promise<void> {
    const create = this.mapper.memberLedgerEntry.toCreateInput(entity);
    const update = this.mapper.memberLedgerEntry.toUpdateInput(entity);

    await this.prismaService.memberLedgerEntry.upsert({
      create,
      update,
      where: { id: entity.id.value },
    });
  }
}
