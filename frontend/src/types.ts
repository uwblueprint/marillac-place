export type ButtonProps = {
  text: string;
  action: () => void;
  is_active: boolean;
};

export type ModalProps = {
  title: string;
  submit_text: string;
  submit_action: () => void;
  cancel_action: () => void;
  children: React.ReactNode;
  error?: string;
};

export type InputProps = {
  label: string;
  current_value: string;
  action: any;
};
