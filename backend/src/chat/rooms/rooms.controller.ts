import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@Controller('profile/chatRooms')
export class RoomsController {
    


    @UseGuards(JwtGuard)
    @Get()
    async getChatRooms() {
        
    }
}