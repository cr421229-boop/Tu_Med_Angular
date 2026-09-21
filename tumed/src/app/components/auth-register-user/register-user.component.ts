import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'tm-register-user',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  submitted = false;
  serverError = '';
  form: ReturnType<typeof this.buildForm>;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.buildForm();
  }

  private buildForm() {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{7,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    }, { validators: passwordsMatch });
  }

  get f() { return this.form.controls; }

  submit() {
    this.submitted = true;
    this.serverError = '';
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const res = this.auth.registerUser({
      nombre: v.nombre!, apellido: v.apellido!, correo: v.correo!,
      telefono: v.telefono!, password: v.password!
    });
    if (!res.ok) {
      this.serverError = res.message;
      return;
    }
    this.auth.redirectForRole('usuario');
  }
}
