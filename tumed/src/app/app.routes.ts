import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/auth-home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'buscar-publico',
    loadComponent: () => import('./components/auth-public-search/public-search.component').then(m => m.PublicSearchComponent)
  },
  {
    path: 'iniciar-sesion',
    loadComponent: () => import('./components/auth-login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./components/auth-register-select/register-select.component').then(m => m.RegisterSelectComponent)
  },
  {
    path: 'registrarse/usuario',
    loadComponent: () => import('./components/auth-register-user/register-user.component').then(m => m.RegisterUserComponent)
  },
  {
    path: 'registrarse/farmacia',
    loadComponent: () => import('./components/auth-register-pharmacy/register-pharmacy.component').then(m => m.RegisterPharmacyComponent)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () => import('./components/auth-forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./components/auth-reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // ---------- Usuario normal ----------
  {
    path: 'app',
    loadComponent: () => import('./components/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', loadComponent: () => import('./components/user-home/user-home.component').then(m => m.UserHomeComponent) },
      { path: 'buscar', loadComponent: () => import('./components/user-search/user-search.component').then(m => m.UserSearchComponent) },
      { path: 'medicamento/:id', loadComponent: () => import('./components/user-medication-detail/medication-detail.component').then(m => m.MedicationDetailComponent) },
      { path: 'farmacias', loadComponent: () => import('./components/user-pharmacies/user-pharmacies.component').then(m => m.UserPharmaciesComponent) },
      { path: 'farmacia/:id', loadComponent: () => import('./components/user-pharmacy-detail/pharmacy-detail.component').then(m => m.UserPharmacyDetailComponent) },
      { path: 'ofertas', loadComponent: () => import('./components/user-offers/user-offers.component').then(m => m.UserOffersComponent) },
      { path: 'mis-medicamentos', loadComponent: () => import('./components/user-my-medications/my-medications.component').then(m => m.MyMedicationsComponent) },
      { path: 'contacto', loadComponent: () => import('./components/user-contact/contact.component').then(m => m.ContactComponent) },
      { path: 'perfil', loadComponent: () => import('./components/user-profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },

  // ---------- Administrador ----------
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
      { path: 'resumen', loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./components/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'medicamentos', loadComponent: () => import('./components/admin-medications/admin-medications.component').then(m => m.AdminMedicationsComponent) },
      { path: 'farmacias', loadComponent: () => import('./components/admin-pharmacies/admin-pharmacies.component').then(m => m.AdminPharmaciesComponent) },
      { path: 'ofertas', loadComponent: () => import('./components/admin-offers/admin-offers.component').then(m => m.AdminOffersComponent) }
    ]
  },

  // ---------- Farmacia ----------
  {
    path: 'farmacia',
    loadComponent: () => import('./components/pharmacy-layout/pharmacy-layout.component').then(m => m.PharmacyLayoutComponent),
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', loadComponent: () => import('./components/pharmacy-info/pharmacy-info.component').then(m => m.PharmacyInfoComponent) },
      { path: 'medicamentos', loadComponent: () => import('./components/pharmacy-medications/pharmacy-medications.component').then(m => m.PharmacyMedicationsComponent) }
    ]
  },

  { path: '**', redirectTo: '' }
];
