import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas';
import { CreateTodoDto, UpdateTodoDto } from './dto';

dayjs.extend(utc);

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async getByWeek(userId: string, start: string, end: string): Promise<Todo[]> {
    const startUTCTime = dayjs(start).utc().startOf('day').toISOString();
    const endUTCTime = dayjs(end)
      .add(1, 'day')
      .utc()
      .endOf('day')
      .toISOString();

    return this.todoModel
      .find({
        startTime: { $gte: startUTCTime },
        endTime: { $lte: endUTCTime },
        ownerId: { $eq: userId },
      })
      .exec();
  }

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const newTodo = new this.todoModel({ ...createTodoDto, ownerId: userId });
    return newTodo.save();
  }

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
    userId: string,
  ): Promise<Todo> {
    const todo = await this.todoModel.findOneAndUpdate(
      { _id: { $eq: id }, ownerId: { $eq: userId } },
      updateTodoDto,
      { new: true },
    );

    if (!todo) {
      throw new NotFoundException('Todo for this user was not found');
    }

    return todo;
  }

  async remove(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoModel.findOneAndRemove({
      _id: { $eq: id },
      ownerId: { $eq: userId },
    });

    if (!todo) {
      throw new NotFoundException('Todo for this user was not found');
    }

    return todo;
  }
}
