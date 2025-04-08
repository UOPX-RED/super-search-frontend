import { useState, useEffect } from 'react';
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

const Template: StoryFn<typeof ManualInputView> = (args) => {
  const [textValue, setTextValue] = useState(args.textValue || '');
  const [metadataKey, setMetadataKey] = useState(args.metadataKey || '');
  const [metadataValue, setMetadataValue] = useState(args.metadataValue || '');

  useEffect(() => {
    setTextValue(args.textValue || '');
    setMetadataKey(args.metadataKey || '');
    setMetadataValue(args.metadataValue || '');
  }, [args.textValue, args.metadataKey, args.metadataValue]);

  return (
    <div style={{ width: '800px' }}>
      <ManualInputView
        textValue={textValue}
        onTextChange={setTextValue}
        metadataKey={metadataKey}
        onMetadataKeyChange={setMetadataKey}
        metadataValue={metadataValue}
        onMetadataValueChange={setMetadataValue}
        onCsvDataProcessed={(data) => console.log('CSV data processed:', data)}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  textValue: '',
  metadataKey: '',
  metadataValue: ''
};

export const WithSampleData = Template.bind({});
WithSampleData.args = {
  textValue: 'This is a sample text that would need to be audited for sensitive information and compliance requirements. It might contain various references and technical terms.',
  metadataKey: 'Document Type',
  metadataValue: 'Technical Report'
};

export const WithLongText = Template.bind({});
WithLongText.args = {
  textValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.',
  metadataKey: 'Source',
  metadataValue: 'Generated'
};

export const WithLongMetadataValues = Template.bind({});
WithLongMetadataValues.args = {
  textValue: 'Testing display of long metadata values',
  metadataKey: 'Very Long Field Name That Might Cause Layout Issues',
  metadataValue: 'This is an extremely long value that would test how the component handles text overflow and layout constraints in the metadata fields section.'
};

export const CourseExample = Template.bind({});
CourseExample.args = {
  textValue: 'This course explores the fundamentals of programming using Python. Students will learn about data structures, algorithms, and object-oriented programming concepts.',
  metadataKey: 'courseId',
  metadataValue: 'CS101'
};

export const ProgramExample = Template.bind({});
ProgramExample.args = {
  textValue: 'The Bachelor of Business Administration (BBA) program is designed to provide students with a strong foundation in business principles and practices. Throughout the four-year program, students will gain knowledge in accounting, finance, marketing, management, and entrepreneurship.',
  metadataKey: 'programId',
  metadataValue: 'BBA-2025'
};

export const MobileView = Template.bind({});
MobileView.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};
MobileView.args = {
  textValue: 'Mobile view test content',
  metadataKey: 'device',
  metadataValue: 'mobile'
};

export const InteractiveDemo = Template.bind({});
InteractiveDemo.args = {
  textValue: 'Try adding multiple metadata fields and clicking the button below to see all metadata values.',
  metadataKey: 'id',
  metadataValue: 'demo-001'
};

InteractiveDemo.decorators = [
  (Story) => (
    <div>
      <Story />
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => {
            const metadataElement = document.getElementById('allMetadata');
            if (metadataElement && (metadataElement as HTMLInputElement).value) {
              try {
                const metadata = JSON.parse((metadataElement as HTMLInputElement).value);
                alert('Current metadata:\n' + JSON.stringify(metadata, null, 2));
              } catch (e) {
                alert('Error parsing metadata: ' + e);
              }
            } else {
              alert('No metadata found');
            }
          }}
          style={{
            padding: '8px 16px',
            background: '#00B373',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Show All Metadata
        </button>
      </div>
    </div>
  )
];