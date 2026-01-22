import { Select as AntSelect, type SelectProps } from 'antd';

export function Select(props: SelectProps) {
  return (
    <AntSelect
      allowClear
      className="w-full sm:w-40"
      placeholder="Seleccione un valor"
      {...props}
    />
  );
}

Select.Option = AntSelect.Option;
Select.OptGroup = AntSelect.OptGroup;
