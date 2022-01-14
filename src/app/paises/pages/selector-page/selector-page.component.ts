import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  //LLENAR SELECTORES

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];


  //ui
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesServices: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region)
    //     this.paisesServices.getPaisesPorRegion(region)
    //       .subscribe(paises => this.paises = paises);
    //   }
    //   );
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises;
        console.log(paises);
        this.cargando = false;
      });

    //PAIS

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.fronteras = [];
          this.cargando = true;
          this.miFormulario.get('frontera')?.reset('');
        }),
        switchMap(codigo => this.paisesServices.getPaisPorCodigo(codigo))
        , switchMap(pais => this.paisesServices.getPaisBoders(pais?.borders!))
      )
      .subscribe(paises => {
        // this.fronteras = pais?.borders || [];
        this.fronteras = paises;

        this.cargando = false;
      });
  }
  guardar() {
    console.log(this.miFormulario.value);
  }

}
