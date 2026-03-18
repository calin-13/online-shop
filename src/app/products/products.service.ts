import { Injectable, signal } from '@angular/core';
import { Observable, of, tap, delay } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly PRODUCTS_KEY = 'fake_products';
  private products = signal<Product[]>([]);

  constructor() {
    this.loadProductsFromStorage();
  }

  getProducts(): Observable<Product[]> {
    this.loadProductsFromStorage();
    return of(this.products()).pipe(delay(300));
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const products = this.products();
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
    const updated = [...products, newProduct];
    this.products.set(updated);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updated));
    return of(newProduct).pipe(delay(300));
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    const products = this.products();
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, ...product } : p
    );
    const updatedProduct = updatedProducts.find(p => p.id === id)!;
    this.products.set(updatedProducts);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return of(updatedProduct).pipe(delay(300));
  }

  deleteProduct(id: number): Observable<void> {
    const products = this.products();
    const updated = products.filter(p => p.id !== id);
    this.products.set(updated);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(updated));
    return of(void 0).pipe(delay(300));
  }

  getProductsSignal() {
    return this.products;
  }

  private loadProductsFromStorage() {
    const products = localStorage.getItem(this.PRODUCTS_KEY);
    if (products) {
      this.products.set(JSON.parse(products));
    } else {
      this.products.set([]);
    }
  }
} 