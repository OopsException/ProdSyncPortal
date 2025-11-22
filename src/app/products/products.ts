import { Component } from '@angular/core';
import { ApiService } from '../core/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './products.html',
})
export class Products {

  products: any[] = [];
  displayedColumns = ['name', 'altName', 'serialNumber', 'price', 'stockQuantity', 'edit', 'delete'];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.get('/product')
      .subscribe((res: any) => {
        const data = res as any;
        this.products = Array.isArray(data)
          ? data 
          : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  goToCreate() {
    this.router.navigate(['/products/create']);
  }

  goToEdit(product: any) {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  deleteProduct(product: any) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.api.delete(`/product/${product.id}`).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  onRowClick(product: any) {
    this.router.navigate(['/products', product.id, 'cogs']);
  }

  ngOnDestroy() {
  }
}
