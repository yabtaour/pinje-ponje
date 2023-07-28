import { Injectable, Get, Post, Controller, Param, Body } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly prismService: PrismaService) {}

    @Get(':roomId/messages')
    async   getChatMessages(@Param('roomId') roomId: number): Promise<any> | null {
        return this.prismService.messages.findMany({
            where: {
                receiverId: roomId,
            },
        });
    }

    // @Post(':roomId/writeMessage')
    // async   createMessage(@Param('roomId') roomId: number, @Body() Body): Promi
    
}