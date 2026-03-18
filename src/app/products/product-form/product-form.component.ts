import { Component, Input, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

import { ProductsService, Product } from '../products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSelectModule
  ],
  template: `
    <form nz-form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
      <nz-form-item>
        <nz-form-label [nzSpan]="24">Nume</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți numele produsului!">
          <input nz-input formControlName="name" placeholder="Nume produs" />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Descriere</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți descrierea produsului!">
          <textarea nz-input formControlName="description" placeholder="Descriere produs" rows="4"></textarea>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Preț</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți prețul produsului!">
          <nz-input-number
            formControlName="price"
            [nzMin]="0"
            [nzStep]="0.01"
            [nzPrecision]="2"
            style="width: 100%"
          ></nz-input-number>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Categorie</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm selectați categoria produsului!">
          <nz-select formControlName="category" placeholder="Selectați categoria">
            <nz-option nzValue="Electronice" nzLabel="Electronice"></nz-option>
            <nz-option nzValue="Îmbrăcăminte" nzLabel="Îmbrăcăminte"></nz-option>
            <nz-option nzValue="Accesorii" nzLabel="Accesorii"></nz-option>
            <nz-option nzValue="Altele" nzLabel="Altele"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">Stoc</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți stocul produsului!">
          <nz-input-number
            formControlName="stock"
            [nzMin]="0"
            [nzStep]="1"
            style="width: 100%"
          ></nz-input-number>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSpan]="24">URL Imagine</nz-form-label>
        <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți URL-ul imaginii!">
          <input nz-input formControlName="imageUrl" placeholder="URL imagine" />
        </nz-form-control>
      </nz-form-item>

      <div class="form-actions">
        <button nz-button (click)="modalRef.close()">Anulează</button>
        <button
          nz-button
          nzType="primary"
          [disabled]="!productForm.valid"
          [nzLoading]="loading"
          type="submit"
        >
          {{ isEditMode ? 'Salvează' : 'Adaugă' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .product-form {
      padding: 24px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  @Input() product?: Product;
  productForm: FormGroup;
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    public modalRef: NzModalRef,
    @Optional() @Inject(NZ_MODAL_DATA) public modalData: any
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const prod = this.product || (this.modalData && this.modalData.product);
    if (prod) {
      this.isEditMode = true;
      this.productForm.patchValue(prod);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const productData = this.productForm.value;
      const request = this.isEditMode
        ? this.productsService.updateProduct((this.product || (this.modalData && this.modalData.product)).id, productData)
        : this.productsService.addProduct(productData);
      request.subscribe({
        next: () => {
          this.modalRef.close(true);
        },
        error: (error) => {
          console.error('Save product error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
