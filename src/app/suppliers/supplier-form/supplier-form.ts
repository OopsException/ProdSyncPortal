import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api';
import { SharedModule } from '../../shared/shared.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './supplier-form.html'
})
export class SupplierForm {

  supplierForm!: FormGroup;
  title = 'Add Supplier';
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {

    // Build form
    this.supplierForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      altName: [null],
      shopLink: [null],
    });

    // read ID from URL
    this.editingId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.editingId)
      this.loadSupplier(this.editingId);
    else
      this.title = 'Add Supplier';
  }

  loadSupplier(id: number) {
    this.api.get(`/supplier/${id}`).subscribe((res: any) => {
      this.supplierForm.patchValue(res);
      this.title = `Edit ${res.name}`;
    });
  }

  save() {
    const payload = this.supplierForm.value;

    if (this.editingId) {
      this.api.put('/supplier', payload).subscribe(() => {
        // this.router.navigate(['/suppliers']); NOT WORKING
      });
    } else {
      this.api.post('/supplier', payload).subscribe(() => {
        // this.router.navigate(['/suppliers']); NOT WORKING
      });
    }
    this.router.navigate(['/suppliers']);
  }

  ngOnDestroy() {
  }
}
