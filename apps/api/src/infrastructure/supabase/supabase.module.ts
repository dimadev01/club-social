import { Module } from '@nestjs/common';

import { SupabaseRepository } from './supabase.repository';

@Module({
  exports: [SupabaseRepository],
  providers: [SupabaseRepository],
})
export class SupabaseModule {}
