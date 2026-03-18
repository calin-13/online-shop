import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { ProductsService, Product } from '../products.service';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    NzPopconfirmModule,
    ProductFormComponent
  ],
  template: `
    <div class="product-list-container">
      <div class="header">
        <h2>Lista Produselor</h2>
        <div class="actions">
          <nz-input-group nzPrefixIcon="search" [nzSuffix]="suffixTemplate">
            <input
              nz-input
              placeholder="Caută produse..."
              [(ngModel)]="searchText"
              (ngModelChange)="onSearch()"
            />
          </nz-input-group>
          <button nz-button nzType="primary" (click)="openModal()">
            Adaugă Produs
          </button>
        </div>
      </div>

      <nz-table
        #basicTable
        [nzData]="filteredProducts"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        [nzShowSizeChanger]="true"
        [nzLoading]="loading"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th
              *ngFor="let column of columns"
              [nzSortFn]="column.sortFn"
            >
              {{ column.title }}
            </th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of basicTable.data">
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price | currency:'RON' }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button nz-button nzType="primary" nzSize="small" (click)="openModal(product)">
                Editează
              </button>
              <nz-popconfirm
                nzTitle="Sigur doriți să ștergeți acest produs?"
                nzOkText="Da"
                nzCancelText="Nu"
                (nzOnConfirm)="deleteProduct(product.id)"
              >
                <button nz-button nzType="primary" nzDanger nzSize="small">
                  Șterge
                </button>
              </nz-popconfirm>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>

    <ng-template #suffixTemplate>
      <span nz-icon nzType="search"></span>
    </ng-template>
  `,
  styles: [`
    .product-list-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .actions {
      display: flex;
      gap: 16px;
    }

    nz-input-group {
      width: 300px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchText = '';
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  columns = [
    {
      title: 'Nume',
      sortFn: (a: Product, b: Product) => a.name.localeCompare(b.name)
    },
    {
      title: 'Descriere',
      sortFn: (a: Product, b: Product) => a.description.localeCompare(b.description)
    },
    {
      title: 'Preț',
      sortFn: (a: Product, b: Product) => a.price - b.price
    },
    {
      title: 'Categorie',
      sortFn: (a: Product, b: Product) => a.category.localeCompare(b.category)
    },
    {
      title: 'Stoc',
      sortFn: (a: Product, b: Product) => a.stock - b.stock
    }
  ];

  constructor(
    private productsService: ProductsService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filterProducts();
        this.total = this.products.length;
      },
      error: (error) => {
        this.message.error('Eroare la încărcarea produselor!');
        console.error('Load products error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    if (!this.searchText) {
      this.filteredProducts = this.products;
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }
    this.total = this.filteredProducts.length;
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.filterProducts();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
  }

  openModal(product?: Product): void {
    const modalRef = this.modal.create({
      nzTitle: product ? 'Editează Produs' : 'Adaugă Produs',
      nzContent: ProductFormComponent,
      nzData: { product },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.message.success('Produs șters cu succes!');
        this.loadProducts();
      },
      error: (error) => {
        this.message.error('Eroare la ștergerea produsului!');
        console.error('Delete product error:', error);
      }
    });
  }
}
