import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { GroupsService } from '../../services/groups.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Grupo } from '../../models/group.model';

export class GroupsDataSource implements DataSource<Grupo> {

    public groupsSubject = new BehaviorSubject<Grupo[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private groupsService: GroupsService) { }

    connect(collectionViewer: CollectionViewer): Observable<Grupo[]> {
        return this.groupsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.groupsSubject.complete();
        this.loadingSubject.complete();
    }

    loadGropus(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10): void {

        this.loadingSubject.next(true);
        this.groupsSubject.next([]);

        this.groupsService.getGroups(filter, sortDirection,
            pageIndex, pageSize).subscribe((groups: Grupo[]) => {
                this.groupsSubject.next(groups);
                this.loadingSubject.next(false);
            },
            (err) => {
                console.log('error cargando grupos: ');
                console.log(err);
                this.loadingSubject.next(false);
            });

    }
}
