import { Meta, StoryFn } from '@storybook/react';
import AuditForm from './AuditForm';

export default {
  title: 'Components/AuditForm',
  component: AuditForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
} as Meta<typeof AuditForm>;

const Template: StoryFn<typeof AuditForm> = () => <AuditForm />;

export const Default = Template.bind({});

export const WithPrefilledKeywords = () => {
  return <AuditForm />;
};

export const ManualTabSelected = () => {
  return <AuditForm />;
};

export const AutoScanTabSelected = () => {
  return <AuditForm />;
};