import { StoryFn as ComponentStory, Meta as ComponentMeta } from '@storybook/react';
import Chips from './chiptabs';
import { Box } from '@mui/material';

export default {
  title: 'Components/Chips',
  component: Chips,
  argTypes: {
    label: { control: 'text' },
    onDelete: { action: 'deleted' },
    customColor: { control: 'color' },
    customTextColor: { control: 'color' },
    showDeleteOnlyOnHover: { control: 'boolean' },
  },
} as ComponentMeta<typeof Chips>;

const Template: ComponentStory<typeof Chips> = (args) => <Chips {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Chips',
  onDelete: () => {},
  showDeleteOnlyOnHover: true,
};

export const MultipleChips: ComponentStory<typeof Chips> = () => {
  const keywords = ['React', 'TypeScript', 'Material UI'];
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {keywords.map((keyword) => (
        <Chips 
          key={keyword} 
          label={keyword} 
          onDelete={() => console.log(`Delete ${keyword}`)}
        />
      ))}
    </Box>
  );
};