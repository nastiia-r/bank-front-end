import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ClientService } from '../../client-service/client.service';
import {
  ILoan,
  IPayments,
  LoanTypeCondition,
} from '../../client-model/client.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-payment',
  imports: [FormsModule, CommonModule, HttpClientModule, ClarityModule],
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.css',
  providers: [ClientService],
  encapsulation: ViewEncapsulation.None,
})
export class AddPaymentComponent {
  @Input() isOpenPay: boolean = false;
  @Output() closeModalPay = new EventEmitter<void>();
  @Output() paySubmitted = new EventEmitter<IPayments>();
  clientId: string | null = null;
  @Input() loanId: string | null = null;

  recommendedPayment: number = 0;
  penaltyPayment: number = 0;

  calculateRecommendedPayment(loan: ILoan): number {
    if (loan?.loanType?.conditions === LoanTypeCondition.Mounth) {
      let loanAmount = loan.payable;
      let loanTerm = loan.loanType.term;
      let sum = Number((loanAmount / loanTerm).toFixed(2));
      return sum;
    } else if (loan?.loanType?.conditions === LoanTypeCondition.One) {
      let sum = loan.payable;
      return sum;
    }

    return 0;
  }

  closePay() {
    this.isOpenPay = false;
    this.closeModalPay.emit();
    this.newPay = {
      date: null,
      amount: 0,
    };
  }

  submitPay() {
    if (!this.clientId) {
      return;
    }
    if (!this.loanId) {
      return;
    }
    if (!this.newPay.amount || this.newPay.amount < 0) {
      return;
    }

    const today = new Date();
    this.newPay.date = today;

    this.clientService
      .createPayToLoan(this.clientId, this.loanId, this.newPay)
      .subscribe({
        next: (pay) => {
          this.paySubmitted.emit(pay);
          this.closePay();
        },
        error: (error) => {
          console.error('Error creating payment:', error);
        },
      });
  }

  newPay: IPayments = {
    date: null,
    amount: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');

    if (this.loanId && this.clientId) {
      this.clientService
        .fetchLoanById(this.clientId, this.loanId)
        .subscribe((loan: ILoan) => {
          this.recommendedPayment = this.calculateRecommendedPayment(loan);
        });
    }
  }
}
