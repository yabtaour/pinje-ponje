import { createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const GetUser = createParamDecorator((data, req): User => {
    return req.user;
});