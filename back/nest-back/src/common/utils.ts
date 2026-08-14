import { OrderDTO } from './dtos/order.dto';

export function orderIntoFindOptions(orderDto: OrderDTO<any>[]) {
    const order = orderDto.reduce<Record<string, string>>(
        (acc, order) => {
            acc[order.field] = order.direction.toUpperCase();
            return acc;
        },
        {} as Record<string, string>,
    );

    return order;
}
