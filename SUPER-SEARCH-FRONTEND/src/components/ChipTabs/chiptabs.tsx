import React from "react";
import { Chip as MuiChip, ChipProps as MuiChipProps } from "@mui/material";

export interface CustomChipProps extends Omit<MuiChipProps, 'sx'> {
  showDeleteOnlyOnHover?: boolean;
  customColor?: string;
  customTextColor?: string;
  customHoverColor?: string;
}

const Chips: React.FC<CustomChipProps> = ({
  showDeleteOnlyOnHover = true,
  customColor = "rgba(252, 0, 0, 0.6)",
  customTextColor = "#292A2E",
  customHoverColor = "rgba(252, 0, 0, 0.3)",
  ...props
}) => {
  return (
    <MuiChip
      {...props}
      sx={{
        backgroundColor: customColor,
        color: customTextColor,
        "& .MuiChip-deleteIcon": {
          display: showDeleteOnlyOnHover ? "none" : "block",
          color: customTextColor,
        },
        "&:hover": {
          backgroundColor: customHoverColor,
          "& .MuiChip-deleteIcon": {
            display: "block",
          },
        },
      }}
      variant="filled"
    />
  );
};

export default Chips;