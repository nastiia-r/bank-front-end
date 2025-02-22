import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ClarityModule } from '@clr/angular';
import { ClientService } from '../../client-service/client.service';
import {
  IClient,
  LoanTypeName,
  OwnershipType,
} from '../../client-model/client.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HeaderComponent,
    ClarityModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css',
  providers: [ClientService, DatePipe],
})
export class AddClientComponent {
  loanTypeNames = Object.values(LoanTypeName);
  ownershipTypes = Object.values(OwnershipType);

  client: IClient = {
    clientName: '',
    ownershipType: null,
    address: '',
    phone: '',
    contactPerson: '',
    loans: [],
  };

  constructor(private clientService: ClientService, private router: Router) {}

  onSubmit() {
    const clientToSend = { ...this.client };

    this.router.navigate(['/clients']);

    this.clientService.createClient(clientToSend).subscribe({
      next: (response) => {
        this.client = {
          clientName: '',
          ownershipType: null,
          address: '',
          phone: '',
          contactPerson: '',
          loans: [],
        };
      },
      error: (error) => {
        console.error('Помилка створення клієнта:', error);
      },
    });
  }
}
