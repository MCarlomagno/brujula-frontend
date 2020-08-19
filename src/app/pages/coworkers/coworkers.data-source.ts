import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Coworker } from '../../models/coworker.model';
import { CoworkersService } from '../../services/coworkers.service';
import { BehaviorSubject, Observable } from 'rxjs';

export class CoworkersDataSource implements DataSource<Coworker> {

    public coworkersSubject = new BehaviorSubject<Coworker[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public coworkersCountSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private coworkersService: CoworkersService) { }

    connect(collectionViewer: CollectionViewer): Observable<Coworker[]> {
        return this.coworkersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.coworkersSubject.complete();
        this.loadingSubject.complete();
    }

    loadCoworkers(filter = '', group = null, plan = null, bornDate = null, sortDirection = 'asc', pageIndex = 0, pageSize = 10): void {

        this.loadingSubject.next(true);
        this.coworkersSubject.next([]);
        this.coworkersCountSubject.next(0);

        let bornDateObject = null;
        if (bornDate) {
            const isoString = bornDate.toISOString().split('T')[0];
            let day = isoString.split('-')[2];
            let month = isoString.split('-')[1];

            if (day[0] === '0') {
                day = day[1];
            }

            if (month[0] === '0') {
                month = month[1];
            }

            bornDateObject = month + '-' + day;
        }

        this.coworkersService.getCoworkers(filter, group , plan , bornDateObject , sortDirection,
            pageIndex, pageSize).subscribe((result) => {
                console.log(result);
                this.coworkersCountSubject.next(result.coworkersCount);
                this.coworkersSubject.next(result.coworkers);
                this.loadingSubject.next(false);
            },
            (err) => {
                console.log('error cargando coworkers: ');
                console.log(err);
                this.loadingSubject.next(false);
            });

    }
}
