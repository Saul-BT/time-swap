import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ErrorManager } from '../error-handling/error.manager';
import { Order } from '../enums/order.enum';
import { OrderDTO } from '../dtos/order.dto';

export class OrderPipe implements PipeTransform {
    constructor(private readonly fieldEnum: Record<string, string>) {
        this.fieldEnum = Object.fromEntries(
            Object.entries(this.fieldEnum).map(([key, value]) => [key.toLowerCase(), value]),
        );
    }

    transform(value: string | string[], metadata: ArgumentMetadata): OrderDTO<string>[] {
        if (value === undefined) {
            return [];
        }

        if (typeof value === 'string') {
            return this.transform([value], metadata);
        }

        return value.map((orderString: string) => {
            const [field, order] = orderString.split(':');

            if (!field || !order) {
                throw new ErrorManager(
                    'BAD_REQUEST',
                    'INVALID ORDER: ' + orderString,
                );
            }

            const dbField = this.fieldEnum[field.toLowerCase()];

            if (!dbField) {
                throw new ErrorManager(
                    'BAD_REQUEST',
                    'INVALID FIELD',
                );
            }

            if (!Object.values(Order).includes(order.toUpperCase() as Order)) {
                throw new ErrorManager(
                    'BAD_REQUEST',
                    'INVALID ORDER DIRECTION',
                );
            }

            const orderDto = new OrderDTO<string>();
            orderDto.field = dbField;
            orderDto.direction = order as Order;

            return orderDto;
        });
    }
}
