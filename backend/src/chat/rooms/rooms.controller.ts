import { Controller, Get, Post, UseGuards, Delete, Req, Res } from "@nestjs/common";
import { JWTGuard } from "src/auth/guards/jwt.guard";
import { RoomService } from "./rooms.service";
import { Response, Request } from "express"; 
@Controller('profile/chatRooms')
export class RoomController {
		constructor (private readonly roomService: RoomService) {}

    @UseGuards(JWTGuard)
    @Get()
    async getChatRooms(@Req() request: any) {
				const user = request.user;
				console.log(user);
				console.log(user.sub);
        return this.roomService.getChatRooms(Number(user.sub));
    }

		@UseGuards(JWTGuard)
		@Post()
		async createChatRoom() {

		}

		@UseGuards(JWTGuard)
		@Delete()
		async deletChatRoom() {

		}
}