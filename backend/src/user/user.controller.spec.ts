import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { JwtAuthService } from '../auth/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { createMock } from '@golevelup/ts-jest'
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockRequest = (token: any) => ({
    user: {
        sub: token,
    }
});
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

const mockUserService = {

    // FindUserByToken: jest.fn().mockImplementation(async (req) => {
    //     if (req.user.sub == 1)
    //         return { id: 5 };
    //     else
    //         return null;
    // }),
}


describe('UserController', () => {
  let controller: UserController;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule, ProfilesModule, UserModule],
        providers: [UserService, JwtService, JwtAuthService, PrismaService],
        controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe("FindUserByToken", () => {

    it("should return me", async () => {
      const req = mockRequest(1);
      const user = { id: 5, email : "r@r.com", passowrd: "1234" };
      jest.spyOn(controller, 'FindUserByToken').mockImplementation(async () => (req.user.sub));
      expect(await controller.FindUserByToken(req)).toBe(1);
      })

    it("should return 404 if user not found", async () => {
      const req = mockRequest(3);
      const res = mockResponse();
      jest.spyOn(controller, 'FindUserByToken').mockRejectedValue(new HttpException('User not found', HttpStatus.NOT_FOUND));
      await expect(controller.FindUserByToken(req)).rejects.toThrow(HttpException);
      await expect(controller.FindUserByToken(req)).rejects.toThrow('User not found');
    })
  })


  afterEach(jest.clearAllMocks)

});

