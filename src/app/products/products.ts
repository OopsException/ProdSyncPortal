import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductDialog } from './product-dialog/product-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {

  products: any[] = [];
  displayedColumns = ['name', 'serialNumber', 'price', 'stockQuantity', 'items', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.get('/product')
      .subscribe((res: any) => {
        const data = res as any;
        this.products = Array.isArray(data) ? data : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  openCreateDialog() {
    const ref = this.dialog.open(ProductDialog, {
      width: '500px'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.post('/product', result).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  openEditDialog(product: any) {
    const ref = this.dialog.open(ProductDialog, {
      width: '500px',
      data: product
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.put(`/product/${result.id}`, result).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  deleteProduct(product: any) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.api.delete(`/product/${product.id}`).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
