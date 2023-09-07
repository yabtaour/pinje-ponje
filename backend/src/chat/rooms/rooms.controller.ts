import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JWTGuard } from "src/auth/guards/jwt.guard";

@Controller('profile/chatRooms')
export class RoomsController {
    


    @UseGuards(JWTGuard)
    @Get()
    async getChatRooms() {
        
    }
}