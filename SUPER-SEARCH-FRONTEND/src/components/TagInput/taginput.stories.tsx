import  { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import TagInput from "./taginput";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
};
export default meta;

type Story = StoryObj<typeof TagInput>;

const DefaultComponent = () => {
  const [keywords, setKeywords] = useState<string[]>([
    "Diversity",
    "Equity",
    "Inclusion",
    "DEI"
  ]);

  const handleAddTag = (tag: string) => {
    setKeywords((prev) => [...prev, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    setKeywords((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <TagInput
      label="Keywords to identify"
      placeholder="Enter keyword..."
      tags={keywords}
      onAddTag={handleAddTag}
      onRemoveTag={handleRemoveTag}
    />
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};
