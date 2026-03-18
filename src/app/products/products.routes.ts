import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
  }
]; 