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
    current_value: any;
    action: any;
    width?: string;
}
 
export type TableProps = {
  loading: boolean;
  edit: boolean;
  selected: any;
  error: any;
  columns: { header: string; width: string; sort?: JSX.Element }[];
  rows: JSX.Element[][];
  editModal: JSX.Element | null;
};

