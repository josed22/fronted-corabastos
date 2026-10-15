import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Nav } from '../nav/nav';
import { Footer } from '../footer/footer';

/** Estructura de las pantallas internas: encabezado, menú arriba, contenido y pie de página. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Nav, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
