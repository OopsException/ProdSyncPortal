import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-dialog',
  templateUrl: './supplier-dialog.html',
  styleUrls: ['./supplier-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ]
})
export class SupplierDialog {

  supplierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<SupplierDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.supplierForm = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      altName: [data?.altName || ''],
      shopLink: [data?.shopLink || '']
    });
  }

  save() {
    if (this.supplierForm.valid) {
      this.dialog.close(this.supplierForm.value);
    }
  }

  close() {
    this.dialog.close(null);
  }
}
