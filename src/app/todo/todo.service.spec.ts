import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;

  //const todosFake = [{ id: '11111', isDone: true }] as TodoEntity[];
  const todosFake: TodoEntity[] = [
    {
      id: '111',
      task: 'teste',
      isDone: true,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    },
    {
      id: '222',
      task: 'teste',
      isDone: true,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    },
  ];

  const todoRepositoryFake = {
    //findAll: jest.fn(() => Promise.resolve([])),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: todoRepositoryFake,
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  it('Should de able retrieval all todos', async () => {
    todoRepositoryFake.find = jest.fn(() => Promise.resolve(todosFake));
    expect(await todoService.findAll()).toEqual(todosFake);
  });

  it('Should be able retrieval a todo', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(todosFake[0]));
    expect(await todoService.findOne('111')).toEqual(todosFake[0]);
  });

  it('Should not be able retrieval a todo not exists', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(null));
    expect(todoService.findOne('111')).rejects.toThrow(
      new Error('Not found todo'),
    );
  });

  it('Should be able create a todo', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve());
    todoRepositoryFake.create = jest.fn(() => todosFake[1]);
    todoRepositoryFake.save = jest.fn(() => Promise.resolve());
    const todo = await todoService.create({ task: '111', isDone: true });
    expect(todo).toEqual(todosFake[1]);
  });

  it('Should not be able create a todo exists', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(todosFake[0]));
    expect(todoService.create({ task: '111', isDone: true })).rejects.toThrow(
      new Error('todo Already exist!'),
    );
  });
});
