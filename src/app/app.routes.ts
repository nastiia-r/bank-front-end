import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { HomeClientComponent } from './pages/home-client/home-client.component';
import { AddLoanComponent } from './pages/add-loan/add-loan.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard } from './guards/login.guards';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard] },
  {
    path: 'newClient',
    component: AddClientComponent,
    canActivate: [LoginGuard],
  },
  { path: 'clients', component: ClientsComponent, canActivate: [LoginGuard] },
  {
    path: 'clients/:id',
    component: HomeClientComponent,
    canActivate: [LoginGuard],
  },
  { path: '', component: LoginComponent },
];
