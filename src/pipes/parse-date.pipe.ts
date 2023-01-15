import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

dayjs.extend(customParseFormat);

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: string) {
    const isValidDate = dayjs(value, 'YYYY-MM-DD', true).isValid();

    if (!isValidDate) {
      throw new BadRequestException('Invalid date');
    }

    return dayjs(value).format('YYYY-MM-DD');
  }
}
