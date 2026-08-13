import { useState } from "react";
import ReactSelect from "react-select";
import { selectStyles } from "../ui/selectStyles";

interface SelectOption {
  value: string;
  label: string;
}

const Select = ({ options }: { options: SelectOption[] }) => {
  const [selected, setSelected] = useState<SelectOption | null>(options[0] ?? null);

  return (
    <ReactSelect
      value={selected}
      onChange={(opt) => setSelected(opt)}
      options={options}
      styles={selectStyles}
      menuPortalTarget={document.body}
    />
  );
};

export default Select;
