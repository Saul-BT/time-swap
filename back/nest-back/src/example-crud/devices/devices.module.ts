import { forwardRef, Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { deviceRepositoryProvider } from 'src/common/providers/list-repository.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Device])],
    controllers: [DevicesController],
    providers: [DevicesService, deviceRepositoryProvider],
})
export class DevicesModule {}
