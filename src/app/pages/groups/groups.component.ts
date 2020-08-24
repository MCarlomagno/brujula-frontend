import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Grupo } from '../../models/group.model';
import { GroupsService } from '../../services/groups.service';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupComponent } from './create-group/create-group.component';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { GroupsDataSource } from './groups.data-source';
import { tap } from 'rxjs/operators';
import { DeleteGroupComponent } from './delete-group/delete-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit, AfterViewInit {

  // view childs
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // displayed columns
  displayedColumns: string[] = ['nombre', 'oficina', 'id', 'cuit_cuil', 'actions'];

  // current groups
  groups: Grupo[];

  // groups data source
  dataSource: GroupsDataSource;

  // Total groups count
  groupsCount: number;

  // form control for table filter
  filterFormControl = new FormControl('');

  constructor(private groupsService: GroupsService, private matDialog: MatDialog) { }

  ngOnInit(): void {

    this.groupsService.getGroupsCount().subscribe((totalGroups) => {
      this.groupsCount = totalGroups.count;
    });

    this.dataSource = new GroupsDataSource(this.groupsService);

    // loads the groups from backend
    this.dataSource.loadGropus();

    this.dataSource.groupsSubject.subscribe((groups) => {
      this.groups = groups;
    });
  }

  ngAfterViewInit(): void {

    // if the pageinator or sort order changes permorms the query
    this.paginator.page.pipe(
      tap(() => this.loadGroupsPage())
    )
      .subscribe();
  }

  // loads the coworkers page with new filter parameters
  loadGroupsPage(): void {
    this.dataSource.loadGropus(
      this.filterFormControl.value,
      'desc',
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  onGroupSelected(row): void {

    console.log(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: row.id };
    const ref: MatDialogRef<EditGroupComponent> = this.matDialog.open(EditGroupComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { name: 'some name', autofocus: false };
    const ref: MatDialogRef<CreateGroupComponent> = this.matDialog.open(CreateGroupComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  onDelete(element): void {
    console.log(element);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: element.id, name: element.nombre };
    const ref: MatDialogRef<DeleteGroupComponent> = this.matDialog.open(DeleteGroupComponent, dialogConfig);
    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

}
