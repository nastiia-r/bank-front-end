import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LoanTypeName,
  LoanTypeCondition,
} from '../../client-model/client.model';
import { LoanCalculatesService } from '../../client-service/loan-calculate.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ClarityModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  loanTypeNames = Object.values(LoanTypeName);
  selectedType: string = '';
  selectedTerm: number = 0;
  selectedAmount: number = 0;
  monthTotal: number = 0;
  monthAmount: number = 0;
  oneTotal: number = 0;
  rateloan: number = 0;
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

  constructor(private loanCalculateService: LoanCalculatesService) {}

  calculateLoan() {
    this.errorMessage = '';

    if (!this.selectedType || !this.loanTypeLimits[this.selectedType]) {
      this.errorMessage = 'Оберіть коректний тип кредиту!';
      return;
    }

    const limits = this.loanTypeLimits[this.selectedType];
    if (this.selectedAmount > limits.maxAmount) {
      this.errorMessage = `Сума перевищує ліміт для "${this.selectedType}". Максимум: ${limits.maxAmount}`;
      return;
    }

    if (this.selectedTerm > limits.maxTermMonths) {
      this.errorMessage = `Термін перевищує ліміт для "${this.selectedType}". Максимум: ${limits.maxTermMonths} місяців`;
      return;
    }

    this.rateloan = this.loanCalculateService.defineInterestRate(
      this.selectedType
    );
    this.monthTotal = this.loanCalculateService.calculateTotalSum(
      LoanTypeCondition.Mounth,
      this.selectedAmount,
      this.rateloan,
      this.selectedTerm
    );

    this.monthAmount = Number((this.monthTotal / this.selectedTerm).toFixed(2));

    this.oneTotal = this.loanCalculateService.calculateTotalSum(
      LoanTypeCondition.One,
      this.selectedAmount,
      this.rateloan,
      this.selectedTerm
    );
  }
}
