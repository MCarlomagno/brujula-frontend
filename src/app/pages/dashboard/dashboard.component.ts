import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public innerWidth: any;

  userData: any;

  isAdmin: boolean;
  isLeader: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.userData = this.authService.getUserData();
    this.isAdmin = this.userData.rol === 'admin';
    this.isLeader = this.userData.rol === 'leader';
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
