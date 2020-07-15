import { Component, OnInit } from '@angular/core';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateCoworkerComponent } from './create-coworker/create-coworker.component';

@Component({
  selector: 'app-coworkers',
  templateUrl: './coworkers.component.html',
  styleUrls: ['./coworkers.component.scss']
})
export class CoworkersComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'horas_sala', 'horas_sala_consumidas', 'horas_sala_disponibles'];
  loading = false;
  dataSource: Coworker[];

  constructor(private coworkersService: CoworkersService, private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.loading = true;
    this.coworkersService.getCoworkers().subscribe((data) => {
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
    this.matDialog.open(CreateCoworkerComponent, dialogConfig);
  }

}
