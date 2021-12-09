import { Test, TestingModule } from '@nestjs/testing';
import { TodoCreateDTO } from './dto/todo.createDTO';
import { TodoController } from './todo.controller';
import { TodoEntity } from './todo.entity';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  //const todosFake = [{ id: '11111', isDone: true }] as TodoEntity[];
  const todosFake: Partial<TodoEntity>[] = [
    { id: '111', isDone: true },
    { id: '222', isDone: false },
  ];
  const todoDto: TodoCreateDTO = {
    isDone: true,
    task: 'new task',
  };

  const todoCreated = {
    id: '11111111111111',
    isDone: true,
    task: 'new task',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const todoServiceFake = {
    //findAll: jest.fn(() => Promise.resolve([])),
    findAll: jest.fn().mockReturnValue([]),
    finOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: todoServiceFake,
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  it('Should be able retrieval all todos', async () => {
    todoServiceFake.findAll = jest.fn(() => Promise.resolve(todosFake));
    const todos = await todoController.index();
    expect(todos).toEqual(todosFake);
    expect(typeof todos).toEqual('object');
    expect(todos[0]).toHaveProperty('id');
    expect(todos[0]).toHaveProperty('id', '111');
    expect(todos).toHaveLength(2);
    expect(todos[1].isDone).toBe(false);
    expect(todoService.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an exception', async () => {
    todoService.findAll = jest.fn(() => Promise.reject(new Error('Error')));
    expect(todoController.index()).rejects.toThrow(new Error('Error'));
  });

  it('should be able create new todo', async () => {
    todoService.create = jest.fn(() => Promise.resolve(todoCreated));
    const todo = await todoController.create(todoDto);
    expect(todo).toEqual(todoCreated);
    expect(todo.id).toEqual('11111111111111');
    expect(todoService.create).toHaveBeenCalledWith(todoDto);
  });

  it('should throw an exception create new todo', async () => {
    todoService.create = jest.fn(() => Promise.reject(new Error('Error')));
    //jest.spyOn(todoService, 'create').mockImplementation(() => {
    //throw new Error('Error');
    // });
    await expect(todoController.create(todoDto)).rejects.toThrowError(
      new Error('Error'),
    );
  });

  it('should be able to retriever one todo', async () => {
    todoService.findOne = jest.fn(() => Promise.resolve(todoCreated));
    const todo = await todoController.show('1');
    expect(todo).toEqual(todoCreated);
  });

  it('should throw an exception to retriever one todo', async () => {
    todoService.findOne = jest.fn(() => Promise.reject(new Error('Error')));
    expect(todoController.show('1')).rejects.toThrowError(new Error('Error'));
  });
});
