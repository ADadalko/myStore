export interface Cart{
  bill: number,
  items: [{
    model: string,
    price: number,
    img: string,
    description: string,
    quantity: number
  }]
}
