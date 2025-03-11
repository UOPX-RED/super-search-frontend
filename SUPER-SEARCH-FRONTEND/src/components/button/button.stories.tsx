import { Meta, StoryObj } from "@storybook/react";
import Button from "./button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    text: "Click Me",
    color: "#00b373",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default Button Story
export const Default: Story = {
  args: {
    text: "Start Audit",
    onClick: () => alert("Button clicked!"),
  },
};

