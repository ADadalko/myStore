import {CartItem} from './cart-item.model';

export interface Cart{
  bill: number,
  items: [CartItem]
}
