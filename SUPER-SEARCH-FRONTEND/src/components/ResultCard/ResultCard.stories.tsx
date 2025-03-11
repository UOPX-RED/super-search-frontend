import { Meta, StoryObj } from '@storybook/react';
import ResultCard from './ResultCard';
import { Box } from '@mui/material';

const meta: Meta<typeof ResultCard> = {
  title: 'Components/ResultCard',
  component: ResultCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ width: '400px' }}>
        <Story />
      </Box>
    )
  ]
};

export default meta;

type Story = StoryObj<typeof ResultCard>;

export const Course: Story = {
  args: {
    type: "course",
    title: "Bachelor of Science in Business with a concentration in Administration",
    matchedKeywords: ["Equity"],
    allKeywords: ["Equity", "Inclusion", "Diversity"]
  }
};

export const Policy: Story = {
  args: {
    type: "policy",
    title: "Student Conduct Policy",
    matchedKeywords: ["Equity", "Inclusion"],
    allKeywords: ["Equity", "Inclusion", "Diversity"]
  }
};

export const AllMatched: Story = {
  args: {
    type: "course",
    title: "Diversity and Inclusion in the Workplace",
    matchedKeywords: ["Diversity", "Inclusion", "Equity"],
    allKeywords: ["Diversity", "Inclusion", "Equity"]
  }
};

export const NoneMatched: Story = {
  args: {
    type: "policy",
    title: "Attendance Policy",
    matchedKeywords: [],
    allKeywords: ["Diversity", "Inclusion", "Equity"]
  }
};

export const LongTitle: Story = {
  args: {
    type: "course",
    title: "Introduction to Cultural Competency and Social Justice in Educational Settings and Professional Development",
    matchedKeywords: ["Cultural", "Social Justice"],
    allKeywords: ["Cultural", "Social Justice", "Equity", "Diversity"]
  }
};