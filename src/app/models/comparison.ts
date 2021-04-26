export interface Comparison{
  items: [{
    vendor: string,
    chars: Map<string, string>,
    country: string,
    description: string,
    img: string,
    model: string,
    price: number,
  }]
}
