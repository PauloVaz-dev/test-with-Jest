import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './app/todo/todo.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'docker',
      database: 'todo',
      synchronize: true,
      entities: ['dist/app/**/*entity.js'],
    }),
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
