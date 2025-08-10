import { Component, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Online Shopping App';
  products: Product[] = [];
  recentlyAddedProduct: string = '';
  loading = false;
  error: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'Failed to load products. Make sure JSON Server is running on port 3001.';
        this.loading = false;
      }
    });
  }

  onProductAdded(product: Product) {
    this.productService.addProduct(product).subscribe({
      next: (newProduct) => {
        this.products.push(newProduct);
        this.recentlyAddedProduct = `${newProduct.name}, ${newProduct.category}, ${newProduct.quantity}`;
      },
      error: (err) => {
        console.error('Error adding product:', err);
        this.error = 'Failed to add product to server.';
      }
    });
  }
}