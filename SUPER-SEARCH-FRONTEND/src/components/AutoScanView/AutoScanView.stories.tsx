import { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import AutoScanView from './AutoScanView';

export default {
  title: 'Components/AutoScanView',
  component: AutoScanView,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof AutoScanView>;

const Template: StoryFn<typeof AutoScanView> = (args) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>(args.selectedCourses || []);

  const handleSelectCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter(c => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // const handleSelectAll = () => {
  //   if (selectedCourses.length === args.courses.length) {
  //     setSelectedCourses([]);
  //   } else {
  //     setSelectedCourses([...args.courses]);
  //   }
  // };

  return (
    <div style={{ width: '600px' }}>
      <AutoScanView
        {...args}
        selectedCourses={selectedCourses}
        onSelectCourse={handleSelectCourse}
        // onSelectAll={handleSelectAll}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  courses: [
    'CJS/221',
    'CPSS/332',
    'HWA/731',
    'SWRK/350',
  ],
  selectedCourses: [],
};

export const WithSelectedCourses = Template.bind({});
WithSelectedCourses.args = {
  courses: [
    'CJS/221',
    'CPSS/332',
    'HWA/731',
    'SWRK/350',
  ],
  selectedCourses: ['CJS/221', 'CPSS/332'],
};