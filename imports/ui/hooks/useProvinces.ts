import { fetch } from 'meteor/fetch';
import { ArgProvinces } from '@shared/types/arg-province.interface';
import { useQuery } from '@tanstack/react-query';

export const useProvinces = () =>
  useQuery<undefined, Error, ArgProvinces>([], () =>
    fetch(
      'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre'
    ).then((res) => res.json())
  );
