export type ButtonProps = {
  label: string;
  action: () => void;
  is_active: boolean;
  icon?: JSX.Element;
};

export type InputProps = {
  label?: string;
  placeholder?: string;
  current_value: any;
  update_action: React.Dispatch<React.SetStateAction<any>>;
  size: "small" | "medium" | "large" | "full";
};

export type IconProps = {
  size?: number;
  color?: string;
};
