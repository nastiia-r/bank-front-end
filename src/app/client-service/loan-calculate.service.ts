import { Injectable } from '@angular/core';
import { LoanTypeCondition, LoanTypeName } from '../client-model/client.model';

@Injectable({
  providedIn: 'root',
})
export class LoanCalculatesService {
  constructor() {}

  defineInterestRate(typeName: string): number {
    switch (typeName) {
      case LoanTypeName.SBA:
        return 0.5;
      case LoanTypeName.LongTerm:
        return 0.4;
      case LoanTypeName.Equipment:
        return 0.6;
      case LoanTypeName.GovernmentBusiness:
        return 0.3;
      case LoanTypeName.Microloans:
        return 0.75;
      default:
        return 0;
    }
  }

  calculateTotalSum(
    loanConditions: string,
    loanAmount: number,
    loanRateForm: number,
    loanTerm: number
  ): number {
    let loanRate = loanRateForm / 100;
    if (loanConditions === LoanTypeCondition.Mounth) {
      let sum = Number(
        (
          ((loanAmount * loanRate * Math.pow(1 + loanRate, loanTerm)) /
            (Math.pow(1 + loanRate, loanTerm) - 1)) *
          loanTerm
        ).toFixed(2)
      );
      return sum;
    } else if (loanConditions === LoanTypeCondition.One) {
      let sum = Number((loanAmount * (1 + loanRate * loanTerm)).toFixed(2));
      return sum;
    }

    return 0;
  }
}
