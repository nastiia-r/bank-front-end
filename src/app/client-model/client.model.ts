export interface ILoan {
  _id?: string;
  loanType: {
    conditions: LoanTypeCondition | null;
    interestRate: number;
    term: number;
    loanTypeName: LoanTypeName | null;
  };
  amount: number;
  issueDate: Date | null;
  dueDate: Date | null;
  actualReturnDate: Date | null;
  status: LoanStatus | null;
  payable: number;
  totalLoan: number;
  visible: boolean;
  payments: IPayments[];
  penalties: IPenalties[];
}

export interface IPayments {
  date: Date | null;
  amount: number;
}

export interface IPenalties {
  date: Date | null;
  amount: number;
  reason: string;
}

export enum LoanStatus {
  active = 'Активний',
  done = 'Виплачено',
}

export enum LoanTypeCondition {
  Mounth = 'Платіж щомісяця',
  One = 'Один платіж',
}

export enum LoanTypeName {
  SBA = 'Фінансування малого бізнесу',
  LongTerm = 'Довгострокові кредит',
  Equipment = 'Кредити на обладнання',
  GovernmentBusiness = 'Державні бізнес-кредит',
  Microloans = 'Мікрокредит',
}

export enum OwnershipType {
  TOV = 'Товариство з обмеженою відповідальністю',
  AT = 'Акціонерне товариство',
  DP = 'Державне підприємство',
  FOP = 'Фізична особа-підприємець',
}

export interface IClient {
  _id?: string;
  clientName: string;
  ownershipType: OwnershipType | null;
  address: string;
  phone: string;
  contactPerson: string;
  loans: ILoan[];
}
