import { Component } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ClarityModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}
  logout(event: Event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/']);
  }
}
