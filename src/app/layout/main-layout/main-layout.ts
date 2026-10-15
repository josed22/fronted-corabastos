import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

/** Estructura de las pantallas internas: menú lateral, barra superior y contenido. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  protected readonly menuAbierto = signal(false);
}
