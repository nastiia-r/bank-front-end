import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IClient, ILoan, IPayments} from '../../client-model/client.model';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../client-service/client.service';
import { AddLoanComponent } from '../add-loan/add-loan.component';
import { ClarityModule } from '@clr/angular';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-home-client',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    HttpClientModule,
    RouterLink,
    AddLoanComponent,
    AddPaymentComponent,
    ClarityModule
  ],
  providers: [ClientService],
  templateUrl: './home-client.component.html',
  styleUrl: './home-client.component.css'
})
export class HomeClientComponent implements OnInit {
  client: IClient | null = null;
  isModalOpenLoan: boolean = false;
  isModalOpenPay: boolean = false;
  clientId: string | null = null;
  loanIdForPayment: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private clientService: ClientService
  ){}



  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.clientService.fetchClient(clientId).subscribe(
        (data) => {
          this.client = data;
          this.client!.loans = this.client!.loans || [];
          this.filterVisibleLoans();
        },
        (error) => {
          console.error('Error fetching client:', error);
        }
      );
    }
  }

  filterVisibleLoans() {
    if (this.client && this.client.loans) {
      this.client.loans = this.client.loans.filter(loan => loan.visible !== false); 
    }
  }

  openModalLoan(): void {
    this.isModalOpenLoan = true;
    
  }

  openModalPay(loanId: string): void {  
    this.isModalOpenPay = true;
    this.loanIdForPayment = loanId;
  }

  closeModalPay(): void {
    this.isModalOpenPay = false;
    this.loanIdForPayment = null; 
  }

  closeModalLoan(): void {
    this.isModalOpenLoan = false;
  }

  onLoanAdded(newLoan: ILoan) {
    this.closeModalLoan();
    this.ngOnInit();
    
  }

  onPayAdded(newPay: IPayments) {
    this.closeModalPay();
    this.ngOnInit();
    
  }


  checkVisible(loanId: string): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId && loanId) {
      this.clientService.updateLoanVisibility(clientId, loanId).subscribe(() => {
        if (this.client && this.client.loans) {
          this.client.loans = this.client.loans.filter(loan => loan._id !== loanId);  
      }
      }, error => {
        console.error("Error updating loan visibility:", error);
      });
    }
  }
}
