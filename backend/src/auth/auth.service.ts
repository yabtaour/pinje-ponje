import { Injectable } from '@nestjs/common';
import { find } from 'rxjs';
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
            const findUser = await this.userService.FindUserByIntraId(user.intraid);
            console.log("new user created");
            return findUser;
        }
    }

		async validateUser(email: string, password: string): Promise<any> {
		const findUser = await this.userService.FindUserByEmail(email);
		if (findUser && findUser.Hashpassword === password) {
			// const { Hashpassword, ...result } = user;
			return findUser;
		}
		return null;
	}
}
