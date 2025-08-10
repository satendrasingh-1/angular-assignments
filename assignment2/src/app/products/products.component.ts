import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../models/product.model';

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
  isSubmitting = false;

  onSubmit() {
    if (this.newProduct.name && this.newProduct.category && this.newProduct.quantity > 0) {
      this.isSubmitting = true;
      
      // Emit the product (parent will handle HTTP call)
      this.productAdded.emit({ ...this.newProduct });
      
      // Reset form
      this.newProduct = {
        name: '',
        category: '',
        quantity: 1
      };
      
      // Reset submitting state after a short delay
      setTimeout(() => {
        this.isSubmitting = false;
      }, 1000);
    }
  }

  onCategoryChange(category: string) {
    this.newProduct.category = category;
  }
}
