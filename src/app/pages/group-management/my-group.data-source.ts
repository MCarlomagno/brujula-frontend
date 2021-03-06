import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { GroupManagementService } from '../../services/group-management.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coworker } from '../../models/coworker.model';

export class MyGroupDataSource implements DataSource<Coworker> {
    public coworkersSubject = new BehaviorSubject<Coworker[]>([]);
    public loadingSubject = new BehaviorSubject<boolean>(false);
    public coworkersCountSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private groupManagementService: GroupManagementService) { }

    connect(collectionViewer: CollectionViewer): Observable<Coworker[]> {
        return this.coworkersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.coworkersSubject.complete();
        this.loadingSubject.complete();
    }

    loadGroupCoworkers(
        userId: number, filter = '', plan = null, bornDate = null, sortDirection = 'asc', pageIndex = 0, pageSize = 10): void {

        this.loadingSubject.next(true);
        this.coworkersSubject.next([]);
        this.coworkersCountSubject.next(0);

        this.groupManagementService.getGroupCoworkers(filter, userId, plan, bornDate, sortDirection,
            pageIndex, pageSize).subscribe((result) => {
                this.coworkersCountSubject.next(result.coworkersCount - 1);
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
