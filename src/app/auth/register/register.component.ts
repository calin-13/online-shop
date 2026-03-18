import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  template: `
    <div class="register-container">
      <form nz-form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        <h2>Înregistrare</h2>
        
        <nz-form-item>
          <nz-form-label [nzSpan]="24">Nume</nz-form-label>
          <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți numele!">
            <input nz-input formControlName="lastName" placeholder="Nume" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24">Prenume</nz-form-label>
          <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți prenumele!">
            <input nz-input formControlName="firstName" placeholder="Prenume" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24">Email</nz-form-label>
          <nz-form-control [nzSpan]="24" nzErrorTip="Vă rugăm introduceți un email valid!">
            <input nz-input formControlName="email" placeholder="Email" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24">Parolă</nz-form-label>
          <nz-form-control [nzSpan]="24" nzErrorTip="Parola trebuie să conțină cel puțin 6 caractere, o literă mare, o literă mică, o cifră și un caracter special!">
            <input nz-input type="password" formControlName="password" placeholder="Parolă" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="24">Confirmă parola</nz-form-label>
          <nz-form-control [nzSpan]="24" nzErrorTip="Parolele nu coincid!">
            <input nz-input type="password" formControlName="confirmPassword" placeholder="Confirmă parola" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzSpan]="24">
            <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="!registerForm.valid">
              Înregistrare
            </button>
          </nz-form-control>
        </nz-form-item>

        <div class="login-link">
          Ai deja cont? <a routerLink="/auth/login">Autentifică-te</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f0f2f5;
    }

    .register-form {
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

    .login-link {
      text-align: center;
      margin-top: 16px;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Register success:', response);
          this.message.success('Înregistrare reușită!');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.message.error('Înregistrare eșuată! Vă rugăm verificați datele introduse.');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
