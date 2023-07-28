import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class roomsService {
    constructor (
        private readonly prismaService: PrismaService,
        private readonly userService: UserService
    ) {}

    async getChatRooms(id: number) {
        try {
            const user = this.userService.FindUserByIntraId(id);
            const chatMember = this.prismaService.roomMember.findMany({
                where: {
                    userid: Number(user.id),
                },
                include: {
                    chatRoom: true,
                },
            });
            return chatMember.map((chatMem) => chatMem.chatRoom);
        } catch (error) {
            console.log(error);
            return (null);
        }
    } 
}