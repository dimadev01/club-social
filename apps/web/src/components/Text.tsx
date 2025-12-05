import {
  ActionIcon,
  CopyButton,
  createPolymorphicComponent,
  Text as MantineText,
  type TextProps,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { forwardRef } from 'react';

interface Props extends TextProps {
  onCopy?: () => void;
}

export const Text = createPolymorphicComponent<'p', Props>(
  forwardRef<HTMLParagraphElement, Props>(({ onCopy, ...props }, ref) => {
    if (onCopy) {
      return (
        <CopyButton value="Test">
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copiado' : 'Copiar'}>
              <ActionIcon
                color={copied ? 'green' : 'gray'}
                onClick={copy}
                variant="transparent"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      );
    }

    return <MantineText ref={ref} {...props} />;
  }),
);
