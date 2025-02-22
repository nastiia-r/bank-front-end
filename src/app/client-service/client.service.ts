import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IClient, ILoan, IPayments } from '../client-model/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api/clients';

  private readonly _clients$: BehaviorSubject<IClient[]> = new BehaviorSubject<
    IClient[]
  >([]);
  public readonly client$ = this._clients$.asObservable();

  constructor(private http: HttpClient) {
    this.loadClients();
  }

  private loadClients(): void {
    this.http
      .get<IClient[]>(this.apiUrl)
      .pipe(tap((clients) => this._clients$.next(clients)))
      .subscribe();
  }

  public get clients(): IClient[] {
    return this._clients$.getValue();
  }

  public setClients(clients: IClient[]): void {
    this._clients$.next(clients);
  }

  public addNewClient(newClient: IClient): void {
    this._clients$.next([...this.clients, newClient]);
  }

  public getClientByName(clientName: string): IClient | undefined {
    return this.clients.find((t) => t.clientName === clientName);
  }

  public createClient(client: IClient): Observable<IClient> {
    return this.http
      .post<IClient>(this.apiUrl, client)
      .pipe(
        tap((newClient) => this._clients$.next([...this.clients, newClient]))
      );
  }

  public createLoan(clientId: string, loan: ILoan) {
    return this.http.post<ILoan>(
      `http://localhost:3000/api/clients/${clientId}/loans`,
      loan
    );
  }

  public updateLoanVisibility(
    clientId: string,
    loanId: string
  ): Observable<any> {
    const url = `http://localhost:3000/api/clients/${clientId}/loans/${loanId}/visibility`;
    return this.http.patch(url, {});
  }

  public createPayToLoan(
    clientId: string,
    loanId: string,
    payment: IPayments
  ): Observable<IPayments> {
    return this.http.post<IPayments>(
      `http://localhost:3000/api/clients/${clientId}/loans/${loanId}/payments`,
      payment
    );
  }

  public getClientById(id: string): Observable<IClient> {
    return this.http.get<IClient>(`${this.apiUrl}/${id}`);
  }

  public fetchLoanById(clientId: string, loanId: string): Observable<ILoan> {
    const url = `${this.apiUrl}/${clientId}/loans/${loanId}`;
    return this.http.get<ILoan>(url);
  }

  public getAllClients(): void {
    this.http.get<IClient[]>(`${this.apiUrl}`).subscribe((clients) => {
      this._clients$.next(clients);
    });
  }

  public getLoansByClientId(clientId: string): Observable<ILoan[]> {
    const url = `${this.apiUrl}/${clientId}/loans`;
    return this.http.get<ILoan[]>(url);
  }

  public fetchClient(clientId: string): Observable<IClient> {
    const url = `${this.apiUrl}/${clientId}`;
    return this.http.get<IClient>(url);
  }

  public getFilteredClients(filters: any): Observable<IClient[]> {
    let params = new HttpParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http
      .get<IClient[]>(`${this.apiUrl}/search`, { params: params })
      .pipe(tap((clients) => this._clients$.next(clients)));
  }
}
