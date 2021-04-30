import {Review} from './review.model';

export interface Product{
  chars: Map<string,string>,
  country: string,
  description: string,
  id: number,
  img: string,
  model: string,
  price: number,
  reviews: [Review],
  type: string,
  vendor: string,
  addedToComparison: boolean,
}
