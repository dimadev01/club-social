import axios from 'axios';
import { StatesResponse } from '@shared/types/arg-geo.interface';
import { useQuery } from '@tanstack/react-query';

export const useStates = () => {
  const url =
    'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&orden=nombre';

  return useQuery([url], () =>
    axios.get<StatesResponse>(url).then((res) => res.data.provincias)
  );
};
