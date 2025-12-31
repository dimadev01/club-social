import type { SelectProps } from 'antd';
import type { BaseOptionType } from 'antd/es/select';

import {
  type MemberSearchResultDto,
  MemberStatus,
  MemberStatusLabel,
  MemberStatusSort,
} from '@club-social/shared/members';
import { Select } from 'antd';
import { groupBy } from 'es-toolkit/array';
import { useCallback, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useMemberSearch } from './useMemberSearch';

export interface MemberSearchSelectProps extends SelectProps {
  additionalOptions?: MemberSearchResultDto[];
  defaultIds?: string[];
  onMembersChange?: (members?: MemberSearchResultDto[]) => void;
}

export function MemberSearchSelect({
  additionalOptions,
  loading,
  onChange,
  onMembersChange,
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
    const resultMap = new Map<string, MemberSearchResultDto>();

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
      label: `${MemberStatusLabel[status as MemberStatus]} (${members.length})`,
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
        MemberStatusSort[optionA.value as MemberStatus] -
        MemberStatusSort[optionB.value as MemberStatus]
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
      onChange={(value) => {
        onChange?.(value);

        onMembersChange?.(
          members?.filter((member) => value.includes(member.id)),
        );
      }}
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
