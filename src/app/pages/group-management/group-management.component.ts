import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MyGroupDataSource } from './my-group.data-source';
import { GroupManagementService } from '../../services/group-management.service';
import { Coworker } from 'src/app/models/coworker.model';
import { MatPaginator } from '@angular/material/paginator';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Grupo } from 'src/app/models/group.model';
import { Plan } from 'src/app/models/plan.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userId: number;

  // my group data source
  dataSource: MyGroupDataSource;

  // displayed columns
  displayedColumns: string[] = ['email', 'nombre', 'apellido', 'horas_sala', 'horas_sala_consumidas', 'actions'];

  // Coworkers list (for future uses)
  coworkers: Coworker[];
  leaderCoworker: Coworker;
  horasSalaLeader: number = null;
  hoursRegister: Map<number, number> = new Map<number, number>();
  totalHours = 0;

  // Total coworkers count
  coworkersCount: number;

  // form control for table filter
  filterFormControl = new FormControl('');

  // groups
  groups: Grupo[];
  groupFormControl = new FormControl(null);
  // planes
  planes: Plan[];
  planFormControl = new FormControl(null);

  // born date form control
  bornDateFormControl = new FormControl(null);

  constructor(private groupManagementService: GroupManagementService, private auth: AuthService) { }

  ngOnInit(): void {
    this.userId = this.auth.getUserId();
    this.dataSource = new MyGroupDataSource(this.groupManagementService);

    // loads the coworkers from backend
    this.dataSource.loadGroupCoworkers(this.userId);

    this.dataSource.coworkersCountSubject.subscribe((count) => {
      this.coworkersCount = count;
    });

    this.dataSource.coworkersSubject.subscribe((coworkers) => {
      this.coworkers = coworkers;

      this.coworkers.forEach(coworker => {
        this.hoursRegister.set(coworker.id, coworker.horas_sala);
        this.totalHours += coworker.horas_sala;
      });

      this.leaderCoworker = this.coworkers.find(c => c.id === this.userId);

      if (this.leaderCoworker) {
        this.horasSalaLeader = this.leaderCoworker.horas_sala;
      }
    });
  }

  ngAfterViewInit(): void {

    // if the pageinator or sort order changes permorms the query
    this.paginator.page.pipe(
      tap(() => this.loadCoworkersPage())
    )
      .subscribe();
  }

  // loads the coworkers page with new filter parameters
  loadCoworkersPage(): void {

    this.dataSource.loadGroupCoworkers(
      this.userId,
      this.filterFormControl.value,
      this.planFormControl.value,
      this.bornDateFormControl.value ? this.bornDateFormControl.value.toISOString() : null,
      'desc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }


  onCoworkerSelected(row): void { }

  hoursChanged(event, horasSala: number, id: number): void {

    let value = 0;

    if (event.target.value) {
      value = Number.parseInt(event.target.value, 10);
    }

    if (value >= 0) {
      this.hoursRegister.set(id, value);
    }

    let updatedTotal = 0;
    this.hoursRegister.forEach(el => {
      updatedTotal += el;
    });

    const difference = this.totalHours - updatedTotal;

    this.horasSalaLeader = this.leaderCoworker.horas_sala + difference;
  }

  onSubmit(): void {
    console.log(this.hoursRegister);

  }

}
