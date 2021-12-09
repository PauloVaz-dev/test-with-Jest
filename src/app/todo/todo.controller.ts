import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodoCreateDTO } from './dto/todo.createDTO';
import { TodoInputDTO } from './dto/todo.inputDTO';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

@Controller('api/v1/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async index() {
    const todos = await this.todoService.findAll();
    return todos;
  }

  @Post()
  async create(@Body() body: TodoCreateDTO) {
    const { task, isDone } = body;
    return this.todoService.create({ task, isDone });
  }

  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.todoService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: TodoInputDTO,
  ) {
    const { task, isDone } = body;
    return this.todoService.update({
      id,
      task,
      isDone,
    });
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.destroy(id);
  }
}
