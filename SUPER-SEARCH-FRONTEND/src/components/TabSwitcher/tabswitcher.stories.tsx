import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import TabSwitcher from "./tabswitcher";

const meta: Meta<typeof TabSwitcher> = {
  title: "Components/TabSwitcher",
  component: TabSwitcher,
};
export default meta;

type Story = StoryObj<typeof TabSwitcher>;

const DefaultComponent = () => {
  const [tab, setTab] = useState<"MANUAL" | "AUTO">("MANUAL");
  return (
    <TabSwitcher
      activeTab={tab}
      onChangeTab={(newTab) => setTab(newTab)}
    />
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};
