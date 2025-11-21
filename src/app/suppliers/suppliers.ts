import { Component } from '@angular/core';
import { ApiService } from '../core/api';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './suppliers.html',
})
export class Suppliers {

  suppliers: any[] = [];
  displayedColumns = ['name', 'altName', 'shopLink', 'edit', 'delete'];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.api.get('/supplier')
      .subscribe((res: any) => {
        const data = res as any;
        this.suppliers = Array.isArray(data) 
          ? data 
          : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  goToCreate() { 
    this.router.navigate(['/suppliers/create']);
  }

  goToEdit(supplier: any) {
    this.router.navigate(['/suppliers', supplier.id, 'edit']);
  }

  deleteSupplier(supplier: any) {
    if (confirm(`Are you sure you want to delete "${supplier.name}"?`)) {
      this.api.delete(`/supplier/${supplier.id}`).subscribe(() => {
        this.loadSuppliers();
      });
    }
  }

  onNgDestroy() {
  }
}
