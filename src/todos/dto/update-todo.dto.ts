import {
  IsString,
  IsDateString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  text?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  background?: string;
}
