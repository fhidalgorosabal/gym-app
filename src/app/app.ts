import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuOpen = signal(false);

  constructor() {
    this.configureStatusBar();
  }

  private async configureStatusBar() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }
    try {
      // La barra de estado NO se superpone al contenido: Android reserva su espacio,
      // así el contenido scrolleable nunca se dibuja detrás de la hora/batería.
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Fondo rojo (red-600) igual que el header.
      await StatusBar.setBackgroundColor({ color: '#dc2626' });
      // Íconos claros (hora, batería, señal) para que se lean sobre el rojo.
      await StatusBar.setStyle({ style: Style.Dark });
    } catch {
      // Ignorar si la plataforma no soporta alguna de estas llamadas.
    }
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
