import {Card} from './card.model';
import {PersonalInfo} from './personal-info.model';
import {Address} from './address.model';
import {Cart} from './cart';

export interface User{
  auth: string,
  email: string,
  password: string,
  username: string,
  id: string,
  uid: string,
  personalInfo: PersonalInfo,
  address: Address,
  card: Card,
  purchases: [Cart],
}
