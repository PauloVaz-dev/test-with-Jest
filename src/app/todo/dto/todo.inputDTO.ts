import { IsNotEmpty } from 'class-validator';
export class TodoInputDTO {
  @IsNotEmpty()
  task: string;
  isDone: boolean;
}
