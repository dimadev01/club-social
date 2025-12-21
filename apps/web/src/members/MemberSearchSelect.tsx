import type { IMemberSearchResultDto } from '@club-social/shared/members';
import type { SelectProps } from 'antd';
import type { BaseOptionType } from 'antd/es/select';

import {
  UserStatus,
  UserStatusLabel,
  UserStatusSort,
} from '@club-social/shared/users';
import { Select } from 'antd';
import { groupBy } from 'es-toolkit/array';
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useMemberSearch } from './useMemberSearch';

export interface MemberSearchSelectProps extends Omit<
  SelectProps,
  'options' | 'showSearch'
> {
  additionalOptions?: IMemberSearchResultDto[];
  defaultIds?: string[];
}

export function MemberSearchSelect({
  additionalOptions,
  loading,
  value,
  ...props
}: MemberSearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: members,
    hasMore,
    isFetching,
  } = useMemberSearch({ searchTerm });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 300);

  const options = useMemo(() => {
    const resultMap = new Map<string, IMemberSearchResultDto>();

    additionalOptions?.forEach((opt) => resultMap.set(opt.id, opt));

    members?.forEach((result) => {
      if (!resultMap.has(result.id)) {
        resultMap.set(result.id, result);
      }
    });

    const groupedByStatus = groupBy(
      Array.from(resultMap.values()),
      (item) => item.status,
    );

    const groupedOptions: SelectProps['options'] = Object.entries(
      groupedByStatus,
    ).map(([status, members]) => ({
      label: `${UserStatusLabel[status as UserStatus]} (${members.length})`,
      options: members.map((member) => ({
        label: member.name,
        value: member.id,
      })),
      value: status,
    }));

    if (hasMore) {
      groupedOptions.push({
        label: '20+ resultados, refine su búsqueda...',
        options: [],
        value: '__more_group__',
      });
    }

    return groupedOptions;
  }, [members, additionalOptions, hasMore]);

  const filterSort = useCallback(
    (optionA: BaseOptionType, optionB: BaseOptionType) => {
      return (
        UserStatusSort[optionA.value as UserStatus] -
        UserStatusSort[optionB.value as UserStatus]
      );
    },
    [],
  );

  const getNotFoundContent = () => {
    if (searchTerm.length < 2) {
      return 'Escriba al menos 2 caracteres para buscar';
    }

    if (isFetching) {
      return 'Buscando...';
    }

    return 'No se encontraron resultados';
  };

  const handleOnClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const isLoading = loading || isFetching;

  return (
    <Select
      {...props}
      loading={isLoading}
      notFoundContent={<>{getNotFoundContent()}</>}
      onClear={handleOnClear}
      options={options}
      placeholder={props.placeholder ?? 'Buscar socio por nombre o email...'}
      showSearch={{
        filterOption: false,
        filterSort,
        onSearch: debouncedSearch,
        optionFilterProp: 'searchLabel',
      }}
      value={isLoading ? undefined : value}
    />
  );
}
