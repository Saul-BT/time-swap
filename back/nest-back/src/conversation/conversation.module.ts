import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Listing } from '../listing/entities/listing.entity';
import { ContactPermissionService } from './contact-permission.service';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Conversation, Message, Listing]),
        forwardRef(() => AuthModule),
    ],
    controllers: [ConversationController],
    providers: [ConversationService, ContactPermissionService],
})
export class ConversationModule {}