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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  preventKeys = [189];

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

  // success message
  successMessage = 'Grupo editado con éxito';

  // error message
  errorMessage = 'Ocurrió un eror editando al Grupo';

  constructor(private groupManagementService: GroupManagementService,
              private auth: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.totalHours = 0;
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

  onKeyDown($event): void {
    if (this.preventKeys.includes($event.keyCode)) {
      $event.preventDefault();
    }
  }

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

    // leader hours sould be always positive
    if ((this.leaderCoworker.horas_sala + difference) >= 0) {
      this.horasSalaLeader = this.leaderCoworker.horas_sala + difference;
    } else {
      // if the hours exceed the total, then restarts in the initial state
      event.target.value = horasSala;
      this.hoursChanged(event, horasSala, id);
    }

  }

  onSubmit(): void {

    this.dataSource = new MyGroupDataSource(this.groupManagementService);
    this.dataSource.loadingSubject.next(true);

    try {

      this.hoursRegister.forEach((hours, id) => {

        if (id !== this.leaderCoworker.id) {
          const index = this.coworkers.findIndex((cow => cow.id === id));
          this.coworkers[index].horas_sala = hours;
        } else {
          const index = this.coworkers.findIndex((cow => cow.id === id));
          this.coworkers[index].horas_sala = this.horasSalaLeader;
        }
      });

      this.groupManagementService.saveCoworkerHours(this.coworkers).subscribe((result) => {
        console.log(result);
        if (result.success) {
          this.showSnackbar(this.successMessage);
          this.ngOnInit();
        } else {
          this.showSnackbar(this.errorMessage);
          this.dataSource.loadingSubject.next(false);
        }
      }, (err) => {
        this.dataSource.loadingSubject.next(false);
        this.showSnackbar(this.errorMessage);
        console.log(err);
      });

    } catch (err) {
      this.dataSource.loadingSubject.next(false);
      this.showSnackbar(this.errorMessage);
      console.log(err);
    }

  }

  showSnackbar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['snackbar']
    });
  }

}
