import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReserveController, ReserveService, Reserve, ReserveResolver } from '.';

@Module({
  imports: [TypeOrmModule.forFeature([Reserve])],
  controllers: [ReserveController],
  providers: [ReserveService, ReserveResolver],
})
export class ReserveModule {}
