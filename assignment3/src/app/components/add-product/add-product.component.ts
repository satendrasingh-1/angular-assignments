// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product.model';

// @Component({
//   selector: 'app-add-product',
//   templateUrl: './add-product.component.html',
//   styleUrls: ['./add-product.component.css']
// })
// export class AddProductComponent implements OnInit {
//   productForm: FormGroup;
//   submitted = false;
//   loading = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private productService: ProductService,
//     private router: Router
//   ) {
//     this.productForm = this.formBuilder.group({
//       name: ['', [Validators.required, Validators.minLength(2)]],
//       price: ['', [Validators.required, Validators.min(0.01)]],
//       description: ['', [Validators.required, Validators.minLength(10)]],
//       category: ['', Validators.required],
//       inStock: [true]
//     });
//   }

//   ngOnInit(): void {
//   }

//   get f() { 
//     return this.productForm.controls; 
//   }

//   onSubmit(): void {
//     this.submitted = true;

//     if (this.productForm.invalid) {
//       return;
//     }

//     if (confirm('Are you sure you want to add this product?')) {
//       this.loading = true;
//       const product: Product = this.productForm.value;

//       this.productService.addProduct(product).subscribe({
//         next: (result) => {
//           alert('Product added successfully!');
//           this.router.navigate(['/products']);
//         },
//         error: (error) => {
//           alert('Failed to add product. Please try again.');
//           this.loading = false;
//           console.error('Error adding product:', error);
//         }
//       });
//     }
//   }

//   onCancel(): void {
//     if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
//       this.router.navigate(['/products']);
//     }
//   }

//   goBack(): void {
//     window.history.back();
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;
  loading = false;

  // Categories for dropdown (can be moved to a service later)
  categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports',
    'Furniture',
    'Health & Beauty',
    'Automotive'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(999999)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      inStock: [true]
    });
  }

  ngOnInit(): void {
    // Optional: Load categories from service
    // this.loadCategories();
  }

  get f() { 
    return this.productForm.controls; 
  }

  // Enhanced validation check
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  // Get specific error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} is required`;
      if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['min']) return `${this.getFieldDisplayName(fieldName)} must be greater than ${field.errors['min'].min}`;
      if (field.errors['max']) return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['max'].max}`;
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Product name',
      price: 'Price',
      description: 'Description',
      category: 'Category'
    };
    return displayNames[fieldName] || fieldName;
  }

  onSubmit(): void {
    this.submitted = true;

    // Mark all fields as touched to trigger validation display
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      // Scroll to first error field
      this.scrollToFirstError();
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
    // Check if form has unsaved changes
    if (this.productForm.dirty) {
      if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
        this.router.navigate(['/products']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }

  goBack(): void {
    // Check for unsaved changes before going back
    if (this.productForm.dirty) {
      if (confirm('Are you sure you want to leave? All changes will be lost.')) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  }

  // Reset form to initial state
  resetForm(): void {
    if (confirm('Are you sure you want to reset the form?')) {
      this.productForm.reset({
        name: '',
        price: '',
        description: '',
        category: '',
        inStock: true
      });
      this.submitted = false;
    }
  }

  private scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.is-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Optional: Method to load categories from service
  // private loadCategories(): void {
  //   this.productService.getCategories().subscribe({
  //     next: (categories) => this.categories = categories,
  //     error: (error) => console.error('Error loading categories:', error)
  //   });
  // }
}