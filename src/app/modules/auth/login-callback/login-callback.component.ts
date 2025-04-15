import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      const user = jwtDecode(token);
      console.log("user", user);
      // localStorage.setItem('user', JSON.stringify(user));
      // localStorage.setItem('token', token);
      alert('Login Successful!');
      // this.router.navigate(['/']); // or home/dashboard
    } else {
      alert('Login failed.');
    }
  }
}
