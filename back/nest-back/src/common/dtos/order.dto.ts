import { Order } from '../enums/order.enum';

export class OrderDTO<T> {
    field!: T;
    direction!: Order;
}
