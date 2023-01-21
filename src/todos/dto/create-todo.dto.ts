import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  background?: string;
}
