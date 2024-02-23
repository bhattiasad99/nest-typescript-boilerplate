/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ToDoModule } from './to-do/to-do.module';
import { LoggerMiddleware } from './middlewares/initlogger.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { removePrefix } from './utils/helpers';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: removePrefix(process.env.npm_lifecycle_event, "start:") === 'prod' ? '.env' : `.${removePrefix(process.env.npm_lifecycle_event, "start:")}.env`,
  }), ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 10,
  }]),
  MongooseModule.forRoot(process.env.MONGODB_URI, {
    lazyConnection: true
  }), AuthModule, UserModule, ToDoModule],
  controllers: [AppController],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('user', 'to-do')
  }
}
