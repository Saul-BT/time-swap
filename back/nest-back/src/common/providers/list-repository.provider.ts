import { Provider } from '@nestjs/common';
import { createCrudRepositoryProvider } from './create-repository.provider';
import { Device } from 'src/example-crud/devices/entities/device.entity';

export const deviceRepositoryProvider: Provider = createCrudRepositoryProvider(Device, 'DEVICE_REPOSITORY', 'Device');
