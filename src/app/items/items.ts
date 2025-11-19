import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/api';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemDialog } from './item-dialog/item-dialog';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, MatDialogModule],
  templateUrl: './items.html',
  styleUrl: './items.scss',
})
export class Items {

  items: any[] = [];
  displayedColumns = ['name', 'serialNumber', 'price', 'weight', 'supplier', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.api.get('/item')
      .subscribe((res: any) => {
        const data = res as any;
        this.items = Array.isArray(data) ? data : (data?.data ?? data?.content ?? data?.items ?? []);
      });
  }

  openCreateDialog() {
    const ref = this.dialog.open(ItemDialog, {
      width: '500px'
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.post('/item', result).subscribe(() => {
          this.loadItems();
        });
      }
    });
  }

  openEditDialog(item: any) {
    const ref = this.dialog.open(ItemDialog, {
      width: '500px',
      data: item
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.api.put(`/item/${result.id}`, result).subscribe(() => {
          this.loadItems();
        });
      }
    });
  }

  deleteItem(item: any) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.api.delete(`/item/${item.id}`).subscribe(() => {
        this.loadItems();
      });
    }
  }
}
