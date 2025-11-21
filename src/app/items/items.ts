import { Component } from '@angular/core';
import { ApiService } from '../core/api';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './items.html',
})
export class Items {

  items: any[] = [];
  displayedColumns = ['name', 'altName', 'serialNumber', 'price', 'weight', 'supplierName', 'edit', 'delete'];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.api.get('/item')
      .subscribe((res: any) => {
        const data = res as any;
        this.items = Array.isArray(data) 
        ? data 
        : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  goToCreate() {
    this.router.navigate(['/items/create']);
  }

  goToEdit(item: any) {
    this.router.navigate(['/items', item.id, 'edit']);
  }

  deleteItem(item: any) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.api.delete(`/item/${item.id}`).subscribe(() => {
        this.loadItems();
      });
    }
  }

  ngOnDestroy() {
  }
}
