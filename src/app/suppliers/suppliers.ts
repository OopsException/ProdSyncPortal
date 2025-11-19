import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupplierDialog } from './supplier-dialog/supplier-dialog';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss',
})
export class Suppliers {

  suppliers: any[] = [];
  displayedColumns = ['name', 'altName', 'shopLink', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.api.get('/supplier')
      .subscribe((res: any) => {
        const data = res as any;
        this.suppliers = Array.isArray(data) ? data : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  openCreateDialog() {
    const ref = this.dialog.open(SupplierDialog, {
      width: '500px'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.post('/supplier', result).subscribe(() => {
          this.loadSuppliers();
        });
      }
    });
  }

  openEditDialog(supplier: any) {
    const ref = this.dialog.open(SupplierDialog, {
      width: '500px',
      data: supplier
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.put(`/supplier/${result.id}`, result).subscribe(() => {
          this.loadSuppliers();
        });
      }
    });
  }

  deleteSupplier(supplier: any) {
    if (confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      this.api.delete(`/supplier/${supplier.id}`).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }
}
