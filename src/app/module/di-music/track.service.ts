import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {dataToTrack} from 'src/music';
import {greenCrowKotPrishelNazad, kinoPachkaSigaret} from 'src/music/testdata';

@Injectable({providedIn: 'root'})
export class TrackService {
  private readonly dataTracks$ = of([greenCrowKotPrishelNazad, kinoPachkaSigaret]);
  readonly tracks$ = this.dataTracks$.pipe(map((iis) => iis.map(dataToTrack)));
}