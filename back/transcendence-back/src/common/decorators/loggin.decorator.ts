import { SetMetadata } from '@nestjs/common';

export const ENABLE_LOGGING = 'enable_logging';
export const EnableLogging = () => SetMetadata(ENABLE_LOGGING, true);
