import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div
      class="navbar rounded-b-md bg-gradient-to-br from-violet-700 from-20% via-red-500 via-70% to-pink-600 px-2 py-0 shadow-lg"
    >
      <p class="my-auto text-4xl font-bold text-white underline">Quicklists</p>
    </div>
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {}
