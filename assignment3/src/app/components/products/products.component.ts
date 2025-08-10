import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load products. Please make sure JSON Server is running.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product-details', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/edit-product', id]);
  }

  deleteProduct(id: number, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Reload the list
          alert('Product deleted successfully!');
        },
        error: (error) => {
          alert('Failed to delete product. Please try again.');
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}