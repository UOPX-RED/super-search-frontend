import { Meta, StoryObj } from '@storybook/react';
import KeywordsMatchedHeader from './KeywordsMatchedHeader';

const meta: Meta<typeof KeywordsMatchedHeader> = {
  title: 'Components/KeywordsMatchedHeader',
  component: KeywordsMatchedHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof KeywordsMatchedHeader>;

export const NoKeywords: Story = {
  args: {
    matchedKeywords: [],
  },
};

export const FewKeywords: Story = {
  args: {
    matchedKeywords: ['Diversity', 'Inclusion'],
  },
};

export const WithMatchedAndUnmatched: Story = {
  args: {
    matchedKeywords: ['Diversity', 'Inclusion'], 
    allKeywords: ['Diversity', 'Equity', 'Inclusion', 'DEI', 'Minority'],
    showUnmatched: true,
  },
};

export const ManyKeywords: Story = {
  args: {
    matchedKeywords: [
      'Diversity', 
      'Equity', 
      'Inclusion',
    ],
    allKeywords: [
      'Diversity', 
      'Equity', 
      'Inclusion', 
      'DEI', 
      'Minority', 
      'Underrepresented', 
      'Marginalized'
    ],
    showUnmatched: true,
  },
};

export const OnlyUnmatched: Story = {
  args: {
    matchedKeywords: [],
    allKeywords: ['DEI', 'Minority', 'Equity'],
    showUnmatched: true,
  },
};