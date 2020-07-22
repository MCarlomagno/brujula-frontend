import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CreateCoworkerComponent } from './create-coworker/create-coworker.component';
import { MatPaginator } from '@angular/material/paginator';
import { CoworkersDataSource } from './coworkers.data-source';
import { tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-coworkers',
  templateUrl: './coworkers.component.html',
  styleUrls: ['./coworkers.component.scss']
})
export class CoworkersComponent implements OnInit, AfterViewInit {

  // view childs
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // table columns declaration
  displayedColumns: string[] = ['email', 'nombre', 'apellido', 'horas_sala', 'horas_sala_consumidas', 'horas_sala_disponibles'];

  // Coworkers data
  dataSource: CoworkersDataSource;

  // Coworkers list (for future uses)
  coworkers: Coworker[];

  // Total coworkers count
  coworkersCount: number;

  // form control for table filter
  filterFormControl = new FormControl('');

  constructor(private coworkersService: CoworkersService, private matDialog: MatDialog) { }

  ngOnInit(): void {

    this.coworkersService.getCoworkersCount().subscribe((totalCoworkers) => {
      this.coworkersCount = totalCoworkers.count;
    });

    this.dataSource = new CoworkersDataSource(this.coworkersService);

    // loads the coworkers from backend
    this.dataSource.loadCoworkers();

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

}
