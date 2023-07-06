import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if (user && user.password === pass) {
            console.log("user exists");
            const {password, ...result} = user;
            return result;
        }
        console.log("user makaynch");
        return null;
    }
}
