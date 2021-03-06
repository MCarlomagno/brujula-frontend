import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateCoworkerComponent } from './create-coworker/create-coworker.component';
import { MatPaginator } from '@angular/material/paginator';
import { CoworkersDataSource } from './coworkers.data-source';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { EditCoworkerComponent } from './edit-coworker/edit-coworker.component';
import { DeleteCoworkerComponent } from './delete-coworker/delete-coworker.component';
import { Grupo } from 'src/app/models/group.model';
import { Plan } from 'src/app/models/plan.model';

@Component({
  selector: 'app-coworkers',
  templateUrl: './coworkers.component.html',
  styleUrls: ['./coworkers.component.scss']
})
export class CoworkersComponent implements OnInit, AfterViewInit {

  // view childs
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // table columns declaration
  displayedColumns: string[] = ['email', 'nombre', 'apellido', 'horas_sala', 'horas_sala_consumidas', 'horas_sala_disponibles', 'actions'];

  // Coworkers data
  dataSource: CoworkersDataSource;

  // Coworkers list (for future uses)
  coworkers: Coworker[];

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

  constructor(private coworkersService: CoworkersService, private matDialog: MatDialog) { }

  ngOnInit(): void {

    this.coworkersService.getCoworkersCount().subscribe((totalCoworkers) => {
      this.coworkersCount = totalCoworkers.count;
    });


    // loads data for select filters
    this.coworkersService.getPlanesAndGroups().subscribe((result) => {
      if (!result.success) {
        console.log(result.error);
      }

      // creates the customized plan dinamically
      const planPersonalizado: Plan = {
        id: 0,
        nombre: 'Personalizado',
        is_custom: false,
        descripcion: ''
      };

      // sets data on select lists
      this.planes = result.plans;
      this.planes.push(planPersonalizado);
      this.groups = result.groups;
    });

    this.dataSource = new CoworkersDataSource(this.coworkersService);

    // loads the coworkers from backend
    this.dataSource.loadCoworkers();

    this.dataSource.coworkersCountSubject.subscribe((count) => {
      this.coworkersCount = count;
    });

    this.dataSource.coworkersSubject.subscribe((coworkers) => {
      this.coworkers = coworkers;
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
    this.dataSource.loadCoworkers(
      this.filterFormControl.value,
      this.groupFormControl.value,
      this.planFormControl.value,
      this.bornDateFormControl.value ? this.bornDateFormControl.value.toISOString() : null,
      'desc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  // Opens the dialog when fab button has been pressed
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { name: 'some name' };
    const ref: MatDialogRef<CreateCoworkerComponent> = this.matDialog.open(CreateCoworkerComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  onCoworkerSelected(row): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: row.id };
    const ref: MatDialogRef<EditCoworkerComponent> = this.matDialog.open(EditCoworkerComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  onDelete(element): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: element.id, name: element.nombre, surname: element.apellido };
    const ref: MatDialogRef<DeleteCoworkerComponent> = this.matDialog.open(DeleteCoworkerComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
}
