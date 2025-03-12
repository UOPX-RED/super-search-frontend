import { Meta, StoryObj } from '@storybook/react';
import HighlightedSectionCard from './HighlightedSectionCard';

const meta: Meta<typeof HighlightedSectionCard> = {
  title: 'Components/HighlightedSectionCard',
  component: HighlightedSectionCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    matchedWord: { control: { type: 'object' } },
    confidence: { control: 'text' },
    matchedText: { control: 'text' },
    reason: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof HighlightedSectionCard>;

export const Default: Story = {
  args: {
    matchedWord: ['example keyword'],
    confidence: '85%',
    matchedText: 'This text contains an example keyword that was detected by the system.',
    reason: 'The keyword was highlighted because it matches a pattern in our database.',
  },
};

export const MultipleKeywords: Story = {
  args: {
    matchedWord: ['first term', 'second term', 'third term'],
    confidence: '92%',
    matchedText: 'This sample text contains multiple terms that were flagged: first term, second term, and third term are all detected.',
    reason: 'Multiple terms were detected that match patterns in our database.',
  },
};

export const LowConfidence: Story = {
  args: {
    matchedWord: ['possible match'],
    confidence: '45%',
    matchedText: 'This might contain a possible match but the system is not very confident.',
    reason: 'Low confidence match that may require manual review.',
  },
};

export const LongText: Story = {
  args: {
    matchedWord: ['important concept'],
    confidence: '78%',
    matchedText: 'This is a much longer example text that demonstrates how the card handles paragraphs of content. When users submit longer pieces of content, the system still needs to display the matched text in a readable format. This example shows how the important concept appears in context with surrounding text that provides more information about the topic being discussed.',
    reason: 'The important concept was detected within a longer passage of text.',
  },
};

export const NumericConfidence: Story = {
  args: {
    matchedWord: ['technical term'],
    confidence: 0.67,
    matchedText: 'The technical term appears in this specialized context.',
    reason: 'Medium confidence match for a technical or specialized term.',
  },
};