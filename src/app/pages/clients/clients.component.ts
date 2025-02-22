import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IClient } from '../../client-model/client.model';
import { Observable } from 'rxjs';
import { ClientService } from '../../client-service/client.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    HttpClientModule,
    RouterLink,
    SearchComponent,
  ],
  providers: [ClientService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  public clients$!: Observable<IClient[]>;
  public filteredClients: IClient[] = [];

  constructor(private clientsService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.client$;
  }

  onFilterApplied(clients: IClient[]): void {
    this.filteredClients = clients;
  }

  navigateToClientHome(clientId: string | undefined): void {
    if (clientId) {
      const encodedId = encodeURIComponent(clientId);
      this.router.navigate([`clients/${encodedId}`]);
    } else {
      console.error('ID клієнта не знайдено.');
    }
  }

  newClient() {
    this.router.navigate(['newClinet']);
  }
}
