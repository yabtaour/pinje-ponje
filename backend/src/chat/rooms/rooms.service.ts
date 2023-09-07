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
          const member = await this.prismaService.roomMember.findMany({
              where: {
                  userId: Number(id),
              },
              include: {
                  chatRoom: true,
              },
          });
          return member.map((roomMEmber) => roomMEmber.chatRoom);
        } catch (error) {
            console.log(error);
            return (null);
        }
    }

    // async createChatRoom(name: string) {
    //     try {
    //         return this.prismaService.chatRoom.create({
    //             data: {
                    
    //             }
    //         })
    //     }
    // }
}