import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Product not found or failed to load.';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  editProduct(): void {
    if (confirm(`Are you sure you want to edit "${this.product?.name}"?`)) {
      this.router.navigate(['/edit-product', this.product?.id]);
    }
  }

  deleteProduct(): void {
    if (this.product && confirm(`Are you sure you want to delete "${this.product.name}"? This action cannot be undone.`)) {
      this.productService.deleteProduct(this.product.id!).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          alert('Failed to delete product. Please try again.');
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}