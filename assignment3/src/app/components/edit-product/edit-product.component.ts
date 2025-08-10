import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;
  loading = false;
  productId: number = 0;
  originalProduct: Product | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      inStock: [true]
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.originalProduct = product;
        this.productForm.patchValue(product);
      },
      error: (error) => {
        alert('Failed to load product details.');
        this.router.navigate(['/products']);
        console.error('Error loading product:', error);
      }
    });
  }

  get f() { 
    return this.productForm.controls; 
     }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    if (confirm('Are you sure you want to add this product?')) {
      this.loading = true;
      const product: Product = this.productForm.value;

      this.productService.addProduct(product).subscribe({
        next: (result) => {
          alert('Product added successfully!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          alert('Failed to add product. Please try again.');
          this.loading = false;
          console.error('Error adding product:', error);
        }
      });
    }
  }

  onCancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/products']);
    }
  }

  goBack(): void {
    window.history.back();
  }
}