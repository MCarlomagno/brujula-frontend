import { Component, OnInit } from '@angular/core';
import { Grupo } from '../../models/group.model';
import { GroupsService } from '../../services/groups.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { CreateGroupComponent } from './create-group/create-group.component';


const ELEMENT_DATA: Grupo[] = [
  {nombre: 'los IT', id: 1, horas_sala: 2, id_lider: 1},
  {nombre: 'Codigo y cafe', id: 2, horas_sala: 2, id_lider: 1},
  {nombre: 'Otro grupo de nerds', id: 3, horas_sala: 2, id_lider: 1},
];

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'horas_sala'];
  loading = false;
  dataSource: Grupo[];

  constructor(private groupsService: GroupsService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.groupsService.getGroups().subscribe((data) => {
      this.dataSource = data;
      this.loading = false;
    },
    (err) => {
      console.log('error: ' + err);
      this.loading = true;
    });
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { name: 'some name'};
    this.matDialog.open(CreateGroupComponent, dialogConfig);
  }

}
