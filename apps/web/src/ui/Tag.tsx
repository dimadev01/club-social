import type { TagProps } from 'antd';

import { Tag as AntTag } from 'antd';

export function Tag(props: TagProps) {
  return (
    <AntTag
      styles={{
        root: {
          fontSize: 14,
        },
      }}
      variant="outlined"
      {...props}
    />
  );
}
