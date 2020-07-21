import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { BehaviorSubject, Observable } from 'rxjs';

export class CoworkersDataSource implements DataSource<Coworker> {

    public coworkersSubject = new BehaviorSubject<Coworker[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private coworkersService: CoworkersService) { }

    connect(collectionViewer: CollectionViewer): Observable<Coworker[]> {
        return this.coworkersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.coworkersSubject.complete();
        this.loadingSubject.complete();
    }

    loadCoworkers(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10): void {

        this.loadingSubject.next(true);
        this.coworkersSubject.next([]);

        this.coworkersService.getCoworkers(filter, sortDirection,
            pageIndex, pageSize).subscribe((coworkers: Coworker[]) => {
                this.coworkersSubject.next(coworkers);
                this.loadingSubject.next(false);
            },
            (err) => {
                console.log('error cargando coworkers: ');
                console.log(err);
                this.loadingSubject.next(false);
            });

    }
}
