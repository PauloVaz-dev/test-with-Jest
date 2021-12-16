import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';
import { usuarioRepository } from './usuarioRepository';

describe('TodoService', () => {
  let todoService: TodoService;

  jest.mock('./usuarioRepository');

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
      task: 'teste2',
      isDone: false,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    },
  ];

  const todoRepositoryFake = {
    //findAll: jest.fn(() => Promise.resolve([])),
    //find: jest.fn().mockResolvedValue([]),
    //find: jest.fn().mockImplementation(() => Promise.resolve([]));
    find: jest.fn(),
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

  it('teste', () => {
    expect(2 + 2).toBe(4);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  it('Should de able retrieval all todos', async () => {
    todoRepositoryFake.find = jest.fn(() => Promise.resolve(todosFake));

    const todos = await todoService.findAll();
    expect(todos[1].task).toBe('teste2');
    expect(todos).toEqual(todosFake);
    expect(todos).toHaveLength(2);
    expect(todos[0]).toHaveProperty('isDone');
    expect(todos[0]).toHaveProperty('isDone', true);
    expect(todoRepositoryFake.find).toHaveBeenCalledTimes(1);
  });

  it('Should be able retrieval a todo', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(todosFake[0]));

    //jest.spyOn(todoRepositoryFake, 'findOne').mockResolvedValue(todosFake[0]);
    const todo = await todoService.findOne('111');
    expect(todo).toEqual(todosFake[0]);
    expect(todoRepositoryFake.findOne).toHaveBeenCalledWith({
      where: {
        id: '111',
      },
    });
  });

  it('Should not be able retrieval a todo not exists', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(null));
    //const todo = await todoService.findOne('111');
    expect(todoService.findOne('111')).rejects.toThrow(
      new Error('Not found todo'),
    );
  });

  it('Should be able create a todo', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve());

    //todoRepositoryFake.create = jest.fn().mockReturnValue(todosFake[1]);
    todoRepositoryFake.create = jest.fn(() => todosFake[1]);

    todoRepositoryFake.save = jest.fn(() => Promise.resolve());

    const todo = await todoService.create(todosFake[1]);
    expect(todo).toEqual(todosFake[1]);
  });

  it('Should not be able create a todo exists', async () => {
    todoRepositoryFake.findOne = jest.fn(() => Promise.resolve(todosFake[0]));
    /* expect(todoService.create({ task: '111', isDone: true })).rejects.toThrow(
      new Error('todo Already exist!'),
    ); */

    try {
      await todoService.create({ task: '111', isDone: true });
    } catch (err) {
      expect(err.message).toBe('todo Already exist!');
    }
  });

  it('Should not be able return a user', async () => {
    jest.spyOn(usuarioRepository, 'getUsuario').mockReturnValue('devPleno');
    const todo = await todoService.findUser();
    expect(todo).toBe('devPleno');
  });
});
