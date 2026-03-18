import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    NzButtonModule,
    NzIconModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-header>
        <div class="logo">Online Shop Management</div>
        <ul nz-menu nzMode="horizontal" nzTheme="dark">
          <li nz-menu-item *ngIf="authService.isAuthenticated()" routerLink="/products">
            <span nz-icon nzType="shopping" nzTheme="outline"></span>
            Produse
          </li>
          <li nz-menu-item *ngIf="authService.isAuthenticated()" (click)="logout()">
            <span nz-icon nzType="logout" nzTheme="outline"></span>
            Deconectare
          </li>
        </ul>
      </nz-header>

      <nz-content>
        <router-outlet></router-outlet>
      </nz-content>

      <nz-footer>
        Online Shop Management ©2024 Created with Angular and NgZorro
      </nz-footer>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }

    nz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
    }

    .logo {
      color: white;
      font-size: 20px;
      font-weight: bold;
    }

    nz-content {
      padding: 0 50px;
      margin: 16px 0;
    }

    nz-footer {
      text-align: center;
    }

    [nz-menu] {
      line-height: 64px;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
