export interface IngredientesRespuesta {
  data: Ingredientes[];
}

export interface Ingredientes {
  id: number;
  nombre: string;
}

// export interface Links {
//   first: string;
//   last: string;
//   prev: null;
//   next: string;
// }

// export interface Meta {
//   current_page: number;
//   from: number;
//   last_page: number;
//   links: Link[];
//   path: string;
//   per_page: number;
//   to: number;
//   total: number;
// }

// export interface Link {
//   url: null | string;
//   label: string;
//   page: number | null;
//   active: boolean;
// }
