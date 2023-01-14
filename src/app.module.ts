import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TodosModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
  ],
})
export class AppModule {}
