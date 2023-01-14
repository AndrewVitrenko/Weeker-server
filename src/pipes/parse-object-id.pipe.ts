import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const isValidId = Types.ObjectId.isValid(value);

    if (!isValidId) {
      throw new BadRequestException('Invalid id');
    }

    return value;
  }
}
