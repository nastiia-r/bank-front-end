import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ClientService } from '../../client-service/client.service';
import {
  IClient,
  ILoan,
  LoanStatus,
  LoanTypeCondition,
  LoanTypeName,
} from '../../client-model/client.model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { LoanCalculatesService } from '../../client-service/loan-calculate.service';

@Component({
  selector: 'app-add-loan',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, ClarityModule],
  templateUrl: './add-loan.component.html',
  styleUrl: './add-loan.component.css',
  providers: [ClientService, DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class AddLoanComponent {
  @Input() isOpen: boolean = false;
  @Output() closeModalLoan = new EventEmitter<void>();
  @Output() loanSubmitted = new EventEmitter<ILoan>();
  clientId: string | null = null;
  totalSum: number = 0;
  errorMessage: string = '';

  loanTypeLimits: {
    [key: string]: { maxAmount: number; maxTermMonths: number };
  } = {
    [LoanTypeName.SBA]: { maxAmount: 500000, maxTermMonths: 60 },
    [LoanTypeName.LongTerm]: { maxAmount: 2000000, maxTermMonths: 120 },
    [LoanTypeName.Equipment]: { maxAmount: 1000000, maxTermMonths: 36 },
    [LoanTypeName.GovernmentBusiness]: {
      maxAmount: 1000000,
      maxTermMonths: 84,
    },
    [LoanTypeName.Microloans]: { maxAmount: 100000, maxTermMonths: 24 },
  };

  closeLoan() {
    this.isOpen = false;
    this.closeModalLoan.emit();
    this.newLoan = {
      loanType: {
        conditions: null,
        interestRate: 0,
        term: 0,
        loanTypeName: null,
      },
      amount: 0,
      issueDate: null,
      dueDate: null,
      actualReturnDate: null,
      status: null,
      payable: 0,
      totalLoan: 0,
      visible: true,
      payments: [],
      penalties: [],
    };
  }

  submitLoan() {
    this.errorMessage = '';

    if (!this.clientId) {
      return;
    }
    if (
      !this.newLoan.loanType.loanTypeName ||
      !this.newLoan.amount ||
      !this.newLoan.loanType.conditions ||
      !this.newLoan.loanType.term
    ) {
      this.errorMessage = "Будь ласка, заповніть всі обов'язкові поля!";
      return;
    }

    const loanType = this.newLoan.loanType.loanTypeName;
    const amount = this.newLoan.amount;
    const termMonths = this.newLoan.loanType.term;

    if (loanType && this.loanTypeLimits[loanType]) {
      const limits = this.loanTypeLimits[loanType];
      if (amount > limits.maxAmount) {
        this.errorMessage = `Сума перевищує ліміт для "${loanType}". Максимум: ${limits.maxAmount}`;
        return;
      }
      if (termMonths > limits.maxTermMonths) {
        this.errorMessage = `Термін перевищує ліміт для "${loanType}". Максимум: ${limits.maxTermMonths} місяців`;
        return;
      }
    }

    this.newLoan.status = LoanStatus.active;
    const today = new Date();
    this.newLoan.issueDate = today;
    const term = this.newLoan.loanType.term;
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + term);
    this.newLoan.dueDate = dueDate;
    this.newLoan.visible = true;
    this.newLoan.loanType.interestRate =
      this.loanCalculateService.defineInterestRate(
        this.newLoan.loanType.loanTypeName
      );
    this.newLoan.payable = this.loanCalculateService.calculateTotalSum(
      this.newLoan.loanType.conditions,
      this.newLoan.amount,
      this.newLoan.loanType.interestRate,
      this.newLoan.loanType.term
    );
    this.newLoan.totalLoan = this.newLoan.payable;

    this.clientService.createLoan(this.clientId, this.newLoan).subscribe({
      next: (loan) => {
        this.loanSubmitted.emit(loan);
        this.closeLoan();
      },
      error: (error) => {
        console.error('Error creating loan:', error);
      },
    });
  }

  loanTypeConditions = Object.values(LoanTypeCondition);
  loanTypeNames = Object.values(LoanTypeName);
  loanTypeStatus = Object.values(LoanStatus);
  client: IClient | null = null;
  newLoan: ILoan = {
    loanType: {
      conditions: null,
      interestRate: 0,
      term: 0,
      loanTypeName: null,
    },
    amount: 0,
    issueDate: null,
    dueDate: null,
    actualReturnDate: null,
    status: LoanStatus.active,
    payable: 0,
    totalLoan: 0,
    visible: true,
    payments: [],
    penalties: [],
  };

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private loanCalculateService: LoanCalculatesService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id');
  }
}
