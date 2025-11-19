import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.html',
  styleUrls: ['./product-dialog.scss'],
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
export class ProductDialog {

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      serialNumber: [data?.serialNumber || '', Validators.required],
      price: [data?.price || '', Validators.required],
      stockQuantity: [data?.stockQuantity || 0, Validators.required]
    });
  }

  save() {
    if (this.productForm.valid) {
      this.dialog.close(this.productForm.value);
    }
  }

  close() {
    this.dialog.close(null);
  }
}
