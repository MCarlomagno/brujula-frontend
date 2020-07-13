import { Component, OnInit } from '@angular/core';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';

@Component({
  selector: 'app-coworkers',
  templateUrl: './coworkers.component.html',
  styleUrls: ['./coworkers.component.scss']
})
export class CoworkersComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'email', 'horas_sala'];
  loading = false;
  dataSource: Coworker[];

  constructor(private coworkersService: CoworkersService) { }

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

}
