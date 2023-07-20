import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

    async userCreateOrNot(user: any) {
        const checkUser = await this.userService.FindUserByIntraId(user.intraid);
        if (checkUser) {
            console.log("user already exists");
            return checkUser;
        }
        else {
            const userCreated = await this.userService.CreateUser(user);
            console.log("new user created");
            return userCreated;
        }
    }
}
