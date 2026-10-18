import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'customers',
    renderMode: RenderMode.Client
  },
  {
    path: 'scorecard/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'manual-review',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
