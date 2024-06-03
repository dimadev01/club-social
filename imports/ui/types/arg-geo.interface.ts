export interface ArgGeoData {
  id: string;
  nombre: string;
}

export interface StatesResponse {
  provincias: ArgGeoData[];
}

export interface MunicipiosResponse {
  municipios: ArgGeoData[];
}

export interface CitiesResponse {
  localidades: ArgGeoData[];
}
