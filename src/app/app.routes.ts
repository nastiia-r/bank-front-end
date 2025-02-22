import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddClientComponent } from './pages/add-client/add-client.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { HomeClientComponent } from './pages/home-client/home-client.component';
import { AddLoanComponent } from './pages/add-loan/add-loan.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'newClient', component: AddClientComponent } ,
  { path: 'clients', component: ClientsComponent},
  { path: 'clients/:id', component: HomeClientComponent},
  { path: '', component: LoginComponent}
];

