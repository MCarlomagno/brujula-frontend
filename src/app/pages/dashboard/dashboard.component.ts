import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public innerWidth: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  logout(): void {
    this.authService.logout();
  }

  getDrawerModeByWidth(): string {
    if (this.innerWidth < 1024) {
      return 'over';
    }else {
      return 'side';
    }
  }
}
