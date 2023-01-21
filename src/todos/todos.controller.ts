import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../guards';
import { ParseDatePipe, ParseObjectIdPipe } from '../pipes';

import { CreateTodoDto, UpdateTodoDto } from './dto';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todoService: TodosService) {}

  @UseGuards(JwtGuard)
  @Get('week')
  async getTodosByWeek(
    @Query('start', ParseDatePipe) start: string,
    @Query('end', ParseDatePipe) end: string,
    @Request() req,
  ) {
    const todos = await this.todoService.getByWeek(req.user.userId, start, end);
    return { todos };
  }

  @UseGuards(JwtGuard)
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    const createdTodo = await this.todoService.create(
      createTodoDto,
      req.user.userId,
    );
    return { todo: createdTodo };
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateTodo(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Request() req,
  ) {
    const updatedTodo = await this.todoService.update(
      id,
      updateTodoDto,
      req.user.userId,
    );
    return { todo: updatedTodo };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteTodo(@Param('id', ParseObjectIdPipe) id: string, @Request() req) {
    const deletedTodo = await this.todoService.remove(id, req.user.userId);
    return { todo: deletedTodo };
  }
}
