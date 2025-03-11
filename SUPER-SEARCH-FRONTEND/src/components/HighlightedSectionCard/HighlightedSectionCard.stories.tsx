// import type { Meta, StoryObj } from '@storybook/react';
// import HighlightedSectionCard from './HighlightedSectionCard';

// const meta = {
//   title: 'Components/HighlightedSectionCard',
//   component: HighlightedSectionCard,
//   parameters: {
//     layout: 'centered',
//   },
//   tags: ['autodocs'],
//   argTypes: {
//     matchedWord: { control: 'text' },
//     confidence: { control: 'text' },
//     matchedText: { control: 'text' },
//     reason: { control: 'text' },
//   },
// } satisfies Meta<typeof HighlightedSectionCard>;

// export default meta;
// type Story = StoryObj<typeof meta>;

// // export const Default: Story = {
// //   args: {
// //     matchedWord: "Diversity",
// //     confidence: "89%",
// //     matchedText: "Students will examine how social factors influence criminal behavior and the justice system's response.",
// //     reason: "This section acknowledges how different social factors affect the criminal justice system, recognizing the diversity of experiences and perspectives.",
// //   },
// // };

// // export const LongText: Story = {
// //   args: {
// //     matchedWord: "Equity",
// //     confidence: "92%",
// //     matchedText: "Our university is committed to creating opportunities for all students, regardless of their background. We have implemented several programs to ensure equal access to resources and support services for traditionally underserved populations.",
// //     reason: "The text emphasizes providing equal access to resources and support services, focusing on equity for underserved populations, which is a core element of equitable practices in higher education.",
// //   },
// // };

// // export const DEIKeyword: Story = {
// //   args: {
// //     matchedWord: "DEI",
// //     confidence: "95%",
// //     matchedText: "Our goal is to build a community where everyone feels welcome and valued, and where diverse perspectives enhance the learning experience for all.",
// //     reason: "This statement encompasses the core principles of Diversity, Equity, and Inclusion by addressing the value of diverse perspectives and creating a welcoming environment.",
// //   },
// // };

// // export const LowerConfidence: Story = {
// //   args: {
// //     matchedWord: "Inclusion",
// //     confidence: "75%",
// //     matchedText: "The program encourages participation from students of all backgrounds.",
// //     reason: "The text implies inclusivity by encouraging participation from students of all backgrounds, though it doesn't explicitly mention inclusion strategies.",
// //   },
// // };

// export const CustomWidth: Story = {
//   args: {
//     ...Default.args,
//   },
//   decorators: [
//     (Story) => (
//       <div style={{ width: '400px' }}>
//         <Story />
//       </div>
//     ),
//   ],
// };

// export const MobileView: Story = {
//   args: {
//     ...Default.args,
//   },
//   parameters: {
//     viewport: {
//       defaultViewport: 'mobile1',
//     },
//   },
//   decorators: [
//     (Story) => (
//       <div style={{ width: '320px' }}>
//         <Story />
//       </div>
//     ),
//   ],
// };