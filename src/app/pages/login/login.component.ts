import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = 'test@email.com';
  password = '1234';

  userInputEmail = '';
  userInputPassword = '';

  wrongUserInput: Boolean = false;
  constructor(private router: Router) {}

  onLogin() {
    if (
      this.email === this.userInputEmail &&
      this.password === this.userInputPassword
    ) {
      localStorage.setItem('isLoggedIn', 'true');
      this.wrongUserInput = false;
      this.router.navigate(['/home']);
    } else {
      this.wrongUserInput = true;
    }
  }
}
