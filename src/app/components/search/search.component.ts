import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { IClient, LoanTypeName, OwnershipType } from '../../client-model/client.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../client-service/client.service';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClarityModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent {
  LoanTypeName = Object.values(LoanTypeName);
  OwnershipType = Object.values(OwnershipType);
  opened: boolean = false;
  selectedOwnershipTypes: string[] = [];
  selectedLoanTypes: string[] = [];
  form: FormGroup;
  
  @Output() filterApplied = new EventEmitter<IClient[]>();

  constructor(
    private fb: FormBuilder, 
    private clientService: ClientService
  ) { 

      this.form = this.fb.group({
        ownershipType: [''],
        loanTypeName: [''],
        term: '',
        interestRate: '',
        clientName: ''
      });
    }


    

    filter(): void {

      const filters = this.form.value;
      this.clientService.getFilteredClients(filters).subscribe(
        (clients) => {
          this.filterApplied.emit(clients); 
        },
        (error) => {
          this.filterApplied.emit([]); 
        }
      );
    }
    

    onOwnershipChange(event: Event): void {
      const checkbox = event.target as HTMLInputElement;
      if (checkbox.checked) {
        this.selectedOwnershipTypes.push(checkbox.value);
      } else {
        this.selectedOwnershipTypes = this.selectedOwnershipTypes.filter(
          (type) => type !== checkbox.value
        );
      }
      this.form.get('ownershipType')?.setValue(this.selectedOwnershipTypes);
    }
    
    onLoanTypeChange(event: Event): void {
      const checkbox = event.target as HTMLInputElement;
      if (checkbox.checked) {
        this.selectedLoanTypes.push(checkbox.value);
      } else {
        this.selectedLoanTypes = this.selectedLoanTypes.filter(
          (type) => type !== checkbox.value
        );
      }
      this.form.get('loanTypeName')?.setValue(this.selectedLoanTypes);
    }
}

