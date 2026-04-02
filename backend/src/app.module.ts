import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSource } from './infrastructure/database/data-source';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/repository/user.repo';
import { AuthenticateMiddleware } from './infrastructure/middleware/authenticate.middleware';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './infrastructure/services/bcrypt.service';
import { AuthModule } from './features/Auth/auth.module';
import { AuthHelperService } from './infrastructure/services/auth.service';
import { SessionModule } from './features/session/session.module';
import { SocketModule } from './infrastructure/socket/socket.module';
import { SessionRepository } from './infrastructure/repository/session.repo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      ...dataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),

    //Modules
    AuthModule,
    SessionModule,
    SocketModule
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService, UserRepository, AuthHelperService, SessionRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'auth/*path', method: RequestMethod.ALL },
        { path: 'session/otp', method: RequestMethod.POST },
        { path: 'session', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
