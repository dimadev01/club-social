import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { CitiesResponse } from '@shared/types/arg-geo.interface';

export const useCities = (stateId?: string) => {
  const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${stateId}&campos=id,nombre&max=1000&orden=nombre`;

  return useQuery(
    [url],
    () => axios.get<CitiesResponse>(url).then((res) => res.data.localidades),
    { enabled: !!stateId },
  );
};
