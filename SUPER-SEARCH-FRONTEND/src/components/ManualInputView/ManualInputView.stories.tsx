import  { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import ManualInputView from './ManualInputView';

export default {
  title: 'Components/ManualInputView',
  component: ManualInputView,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
} as Meta<typeof ManualInputView>;

// Controlled component template with state management
const Template: StoryFn<typeof ManualInputView> = (args) => {
  const [textValue, setTextValue] = useState(args.textValue || '');
  const [metadataKey, setMetadataKey] = useState(args.metadataKey || '');
  const [metadataValue, setMetadataValue] = useState(args.metadataValue || '');

  return (
    <div style={{ width: '800px' }}>
      <ManualInputView
        textValue={textValue}
        onTextChange={setTextValue}
        metadataKey={metadataKey}
        onMetadataKeyChange={setMetadataKey}
        metadataValue={metadataValue}
        onMetadataValueChange={setMetadataValue}
      />
    </div>
  );
};

// Default empty state
export const Default = Template.bind({});
Default.args = {
  textValue: '',
  metadataKey: '',
  metadataValue: '',
};

// Pre-populated with sample data
export const WithSampleData = Template.bind({});
WithSampleData.args = {
  textValue: 'This is a sample text that would need to be audited for sensitive information and compliance requirements. It might contain various references and technical terms.',
  metadataKey: 'Document Type',
  metadataValue: 'Technical Report',
};

// Long text example
export const WithLongText = Template.bind({});
WithLongText.args = {
  textValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.',
  metadataKey: 'Source',
  metadataValue: 'Generated',
};