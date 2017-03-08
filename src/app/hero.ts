export class Hero {
  id: number;
  name: string;
  addresses: Address[];
}

export class Address {
  street: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
}

export const states = ['CA', 'MD', 'OH', 'VA'];
