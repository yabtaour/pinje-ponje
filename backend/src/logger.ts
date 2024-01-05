import { Injectable, NestInterceptor, OnModuleInit } from '@nestjs/common';

@Injectable()
export class loggingInterceptor implements NestInterceptor, OnModuleInit {
  onModuleInit() {
    console.log('Module has been initialized.');
  }

  intercept(context: any, next: any) {
    const req = context.switchToHttp().getRequest();
    let { method, originalUrl, headers, body } = req;

    console.log('{');
    console.log('Method: ', method);
    console.log('Url: ', originalUrl, '\n}');
    // console.log('Headers: ', headers);
    // console.log('Body: ', body, '}');

    return next.handle();
  }
}
