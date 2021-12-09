import { IsNotEmpty } from 'class-validator';
export class TodoCreateDTO {
  @IsNotEmpty()
  task: string;
  isDone: boolean;
}
