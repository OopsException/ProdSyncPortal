import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api';
import { SharedModule } from '../../shared/shared.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './item-form.html'
})
export class ItemForm {

  itemForm!: FormGroup;
  title = 'Add Item';
  editingId: number | null = null;
  suppliers: any[] = [];
  selectedSupplier: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {

    // Build form
    this.itemForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      altName: [null],
      serialNumber: [null, Validators.required],
      price: [null, Validators.required],
      weight: [null],
      supplierId: [null],
    });

    // read ID from URL
    this.editingId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.editingId) {
      forkJoin({
        suppliers: this.api.get('/supplier'),
        item: this.api.get(`/item/${this.editingId}`)
      }).subscribe(({ suppliers, item }: any) => {

        this.suppliers = Array.isArray(suppliers)
          ? suppliers
          : (suppliers.data ?? suppliers.content ?? suppliers.items ?? []);

        this.itemForm.patchValue(item);

        this.selectedSupplier = this.suppliers.filter(
          s => s.id === item.supplierId);
        
        this.title = `Edit ${item.name}`;
      });
    } else {
      this.title = 'Add Item';
      this.api.get('/supplier').subscribe((sup: any) => {
        this.suppliers = Array.isArray(sup)
          ? sup
          : (sup.data ?? sup.content ?? sup.items ?? []);
      });
    }
  }

  save() {
    const payload = this.itemForm.value;

    if (this.editingId) {
      this.api.put('/item', payload).subscribe(() => {
        // this.router.navigate(['/items']); NOT WORKING
      });
    } else {
      this.api.post('/item', payload).subscribe(() => {
        // this.router.navigate(['/items']); NOT WORKING
      });
    }
    this.router.navigate(['/items']);
  }

  onSupplierSelect(event: any) {
    const item = Array.isArray(event) ? event[0] : event;
    if (item && item.id != null) {
      this.itemForm.patchValue({ supplierId: item.id });
    }
  }

  onSupplierClear() {
    this.itemForm.patchValue({ supplierId: null });
    this.selectedSupplier = [];
  }

  ngOnDestroy() {
  }
}
