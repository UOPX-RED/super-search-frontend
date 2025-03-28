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

  const handleCourseContentFetched = (content: string, courseCode: string) => {
    console.log(`Fetched content for ${courseCode}:`, content);
  };

  return (
    <div style={{ width: '600px' }}>
      <AutoScanView
        selectedCourses={selectedCourses}
        onSelectCourse={handleSelectCourse}
        onCourseContentFetched={handleCourseContentFetched}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  selectedCourses: [],
};

export const WithSelectedCourses = Template.bind({});
WithSelectedCourses.args = {
  selectedCourses: ['CJS/221', 'CPSS/332'],
};