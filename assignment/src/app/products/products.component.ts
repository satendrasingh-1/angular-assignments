import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Product {
  name: string;
  category: string;
  quantity: number;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  @Input() appName: string = '';
  @Output() productAdded = new EventEmitter<Product>();

  newProduct: Product = {
    name: '',
    category: '',
    quantity: 1
  };

  categories = ['Computers', 'Mobiles', 'Appliances'];

  onSubmit() {
    if (this.newProduct.name && this.newProduct.category && this.newProduct.quantity > 0) {
      this.productAdded.emit({ ...this.newProduct });
      
      // Reset form
      this.newProduct = {
        name: '',
        category: '',
        quantity: 1
      };
    }
  }

  onCategoryChange(category: string) {
    this.newProduct.category = category;
  }
}