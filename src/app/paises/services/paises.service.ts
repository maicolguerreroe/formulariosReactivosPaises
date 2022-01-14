import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private baseUrl: string = 'https://restcountries.com/v2/';
  private API_KEY: string = 'c6ca1ac8ea58f9b297bdf9a1cbcf3607';

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]> {
    return this.http.get<PaisSmall[]>(`${this.baseUrl}/region/${region}?fields=alpha3Code,name`)
  }
  getPaisPorCodigo(codigo: string): Observable<Pais | null> {
    if (!codigo) {
      return of(null);
    }
    return this.http.get<Pais>(`${this.baseUrl}/alpha/${codigo}`);
  }
  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall> {
    return this.http.get<Pais>(`${this.baseUrl}/alpha/${codigo}?fields=name,alpha3Code`);
  }
  getPaisBoders(borders: string[]): Observable<PaisSmall[]> {
    if (!borders) {
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }
}
