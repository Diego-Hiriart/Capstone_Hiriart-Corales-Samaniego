import { Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type ControlledCheckboxPropsType = {
  label: string;
  name: string;
  control: Control<any>;
  defaultValue: boolean;
};

const ControlledCheckbox = ({
  label,
  name,
  control,
  defaultValue,
}: ControlledCheckboxPropsType) => {
  return (
    <FormControlLabel
      label={label}
      control={
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Checkbox
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      }
    />
  );
};

export default ControlledCheckbox;
