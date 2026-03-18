import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  template: `
    <div class="login-container">
      <div class="login-content">
        <form nz-form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <h2>Autentificare</h2>
          
          <nz-form-item>
            <nz-form-label [nzSpan]="24">Email</nz-form-label>
            <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți un email valid!">
              <input nz-input formControlName="email" placeholder="Email" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="24">Parolă</nz-form-label>
            <nz-form-control [nzSpan]="24" nzErrorTip="Parola trebuie să conțină cel puțin 6 caractere!">
              <input nz-input type="password" formControlName="password" placeholder="Parolă" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control [nzSpan]="24">
              <label nz-checkbox formControlName="rememberMe">Ține-mă minte</label>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control [nzSpan]="24">
              <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="!loginForm.valid">
                Autentificare
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>
        <div class="register-link">
          Nu ai cont? <a (click)="goToRegister()" style="cursor:pointer;">Înregistrează-te</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f0f2f5;
    }
    .login-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .login-form {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    h2 {
      text-align: center;
      margin-bottom: 24px;
    }
    .register-link {
      text-align: center;
      margin-top: 16px;
      width: 100%;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.message.success('Autentificare reușită!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          this.message.error('Autentificare eșuată! Vă rugăm verificați datele introduse.');
          console.error('Login error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}