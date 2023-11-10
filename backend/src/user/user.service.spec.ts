import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaModule } from "../prisma/prisma.module";
import { ProfilesModule } from "../profiles/profiles.module";
import { UserModule } from "./user.module";
import { response } from "express";


describe("UserService", () => {
    let service: UserService;

    const requestMock = (token : any) => ({
        user : {
            sub: token,
        },
    });

    const responseMock = {
    } as unknown as Response;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule, ProfilesModule, UserModule],
            providers: [UserService],
        }).compile();
        service = module.get<UserService>(UserService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })


});