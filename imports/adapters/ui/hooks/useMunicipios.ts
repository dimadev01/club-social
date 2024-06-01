import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { MunicipiosResponse } from '@shared/types/arg-geo.interface';

export const useMunicipios = (provinciaId?: string) => {
  const url = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provinciaId}&campos=id,nombre&max=200&orden=nombre`;

  return useQuery(
    [url],
    () => axios.get<MunicipiosResponse>(url).then((res) => res.data.municipios),
    { enabled: !!provinciaId },
  );
};
