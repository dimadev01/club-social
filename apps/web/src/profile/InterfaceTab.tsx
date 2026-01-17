import {
  Theme,
  ThemeAlgorithm,
  ThemeAlgorithmLabel,
  ThemeLabel,
} from '@club-social/shared/users';
import { Radio } from 'antd';

import { useAppContext } from '@/app/AppContext';
import { labelMapToSelectOptions } from '@/shared/lib/utils';
import { Card, Descriptions } from '@/ui';
import { useUpdateMyPreferences } from '@/users/useUpdateMyPreferences';

export function InterfaceTab() {
  const { preferences } = useAppContext();
  const updatePreferences = useUpdateMyPreferences();

  return (
    <Card title="Interfaz">
      <Descriptions>
        <Descriptions.Item label="Tema">
          <Radio.Group
            className="w-full"
            key={preferences.theme}
            onChange={(value) =>
              updatePreferences.mutate({
                theme: value.target.value as Theme,
              })
            }
            options={labelMapToSelectOptions(ThemeLabel)}
            value={preferences.theme}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Modo compacto">
          <Radio.Group
            className="w-full"
            key={preferences.themeAlgorithm}
            onChange={(value) =>
              updatePreferences.mutate({
                themeAlgorithm: value.target.value as ThemeAlgorithm,
              })
            }
            options={labelMapToSelectOptions(ThemeAlgorithmLabel)}
            value={preferences.themeAlgorithm}
          />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
