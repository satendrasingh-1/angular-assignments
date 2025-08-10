import { Component } from '@angular/core';

export interface Product {
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Online Shopping App';
  
  products: Product[] = [
    { name: 'HP Pavilion x360', category: 'Computers', quantity: 4 },
    { name: 'Samsung Galaxy S24', category: 'Mobiles', quantity: 5 },
    { name: 'Racold Geyser', category: 'Appliances', quantity: 3 }
  ];

  recentlyAddedProduct: string = '';

  onProductAdded(product: Product) {
    this.products.push(product);
    this.recentlyAddedProduct = `${product.name}, ${product.category}, ${product.quantity}`;
  }
}
