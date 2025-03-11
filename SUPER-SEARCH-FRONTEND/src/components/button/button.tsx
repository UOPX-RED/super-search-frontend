import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, color = "#00b373" }) => {
  return (
    <button
      onClick={onClick}
      style={{
        background: color,
        color: "white",
        padding: "0.75rem 1.5rem",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontSize: "1rem",
      }}
    >
      {text}
    </button>
  );
};

export default Button;
