import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
    ) {}

//     async validateUser(username: string, pass: string): Promise<any> {
//         const user = await this.userService.findOne(username);
//         if (user && user.password === pass) {
//             console.log("user exists");
//             const {password, ...result} = user;
//             return result;
//         }
//         console.log("user makaynch");
//         return null;
//     }
    async userCreateOrNot(user: any) {
        const checkUser = await this.userService.FindUserByIntraId(user.intraid);
        if (checkUser) {
            console.log("user already exists");
            return checkUser;
        }
        else {
            const userCreated = await this.userService.CraeteUser(user);
            console.log("new user created");
            return userCreated;
        }
    }
}
