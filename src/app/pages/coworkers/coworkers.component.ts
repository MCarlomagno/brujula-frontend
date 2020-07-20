import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCoworkerComponent } from './create-coworker/create-coworker.component';
import { MatPaginator } from '@angular/material/paginator';
import { CoworkersDataSource } from './coworkers.data-source';
import { tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { merge } from 'rxjs';

@Component({
  selector: 'app-coworkers',
  templateUrl: './coworkers.component.html',
  styleUrls: ['./coworkers.component.scss']
})
export class CoworkersComponent implements OnInit, AfterViewInit {

  // view childs
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // table columns declaration
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'horas_sala', 'horas_sala_consumidas', 'horas_sala_disponibles'];

  // Coworkers data
  dataSource: CoworkersDataSource;

  // Coworkers list (for future uses)
  coworkers: Coworker[];

  constructor(private coworkersService: CoworkersService, private matDialog: MatDialog) { }

  ngOnInit(): void {

    this.dataSource = new CoworkersDataSource(this.coworkersService);

    // loads the coworkers from backend
    this.dataSource.loadCoworkers();

    this.dataSource.coworkersSubject.subscribe((coworkers) => {
      this.coworkers = coworkers;
    });
  }

  ngAfterViewInit(): void {

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // if the pageinator or sort order changes permorms the query
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadCoworkersPage())
      )
      .subscribe();
  }

  // loads the coworkers page with new filter parameters
  loadCoworkersPage(): void {
    this.dataSource.loadCoworkers(
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  // Opens the dialog when fab button has been pressed
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { name: 'some name' };
    this.matDialog.open(CreateCoworkerComponent, dialogConfig);
  }

}
