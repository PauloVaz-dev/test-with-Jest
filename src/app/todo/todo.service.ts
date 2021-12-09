import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';

type TodoArgs = {
  id?: string;
  task: string;
  isDone: boolean;
};
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return this.todoRepository.find();
  }

  async findOne(id: string) {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new Error('Not found todo');

    return todo;
  }

  async create({ task, isDone }: TodoArgs): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({
      where: {
        task,
      },
    });

    if (todo) throw new Error('todo Already exist!');

    const todoCreated = this.todoRepository.create({
      task,
      isDone,
    });

    await this.todoRepository.save(todoCreated);

    return todoCreated;
  }

  async update({ id, task, isDone }: TodoArgs) {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new Error('Not found todo');

    Object.assign(todo, {
      task,
      isDone,
    });

    await this.todoRepository.save(todo);
  }

  async destroy(id: string): Promise<boolean> {
    const todo = await this.todoRepository.findOne({
      where: {
        id,
      },
    });

    if (!todo) throw new Error('Not found todo');

    this.todoRepository.softDelete(id);

    return true;
  }
}
