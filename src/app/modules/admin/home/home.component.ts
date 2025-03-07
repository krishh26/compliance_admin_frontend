import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  loginUser: any;
  loginRole: any;
  constructor(
    private authService: AuthServiceService,
    private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
    this.loginRole = this.loginUser.role;
  }

  logout(): void {
    this.authService.logout();
  }
}
