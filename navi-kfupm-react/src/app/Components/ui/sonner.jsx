import { useTheme } from "../../../ThemeContext";

import { Toaster as Sonner } from "sonner";
const Toaster = (props) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      toastOptions={{
    style: {
      fontSize: "22px",
      padding: "16px 20px",
      minWidth: "300px",
      borderRadius: "10px",
    },
  }}
  {...props}
/>
  );};

export { Toaster };
