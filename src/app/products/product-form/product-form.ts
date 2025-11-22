import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api';
import { SharedModule } from '../../shared/shared.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-form.html'
})
export class ProductForm {

  productForm!: FormGroup;
  title = 'Add Product';
  editingId: number | null = null;

  items: any[] = [];
  itemRows: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {

    // Build form
    this.productForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      altName: [null],
      serialNumber: [null, Validators.required],
      price: [null],
      stockQuantity: [null],
    });

    this.editingId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.editingId) {

      // load both lists then map using the SAME object references
      forkJoin({
        items: this.api.get('/item'),
        product: this.api.get(`/product/${this.editingId}`)
      }).subscribe(({ items, product }: any) => {
        this.items = Array.isArray(items)
          ? items
          : (items?.data ?? items?.content ?? items?.items ?? []);

        this.productForm.patchValue(product);
        this.title = `Edit ${product.name}`;

        // selectedItem must be an ARRAY with the exact object from this.items
        this.itemRows = (product.items ?? []).map((itm: any) => ({
          selectedItem: [ this.items.find((x: any) => x.id === itm.id) ].filter(Boolean),
          quantity: itm.quantity
        }));
      });

    } else {
      // load all items for dropdown
      this.api.get('/item').subscribe((items: any) => {
        this.items = Array.isArray(items)
          ? items
          : (items?.data ?? items?.content ?? items?.items ?? []);
      });

      this.title = 'Add Product';
    }
  }

  addItemRow() {
    this.itemRows.push({
      selectedItem: [],
      quantity: null
    });
  }

  removeItemRow(index: number) {
    this.itemRows.splice(index, 1);
  }

  save() {
    const payload = {
      ...this.productForm.value,
      items: this.itemRows.map(r => ({
        itemId: r.selectedItem?.[0]?.id,
        quantity: r.quantity
      }))
    };

    if (this.editingId) {
      this.api.put('/product', payload).subscribe(() => {
        // this.router.navigate(['/products']); NOT WORKING
      });
    } else {
      this.api.post('/product', payload).subscribe(() => {
        // this.router.navigate(['/products']); NOT WORKING
      });
    }
    this.router.navigate(['/products']);
  }

  ngOnDestroy() {
  }
}
