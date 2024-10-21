import { InputHTMLAttributes, ReactNode } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

export interface TextInputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  name: string;
  options?: RegisterOptions;
}

// TODO: Create other field components.
export const TextInputField = (props: TextInputFieldProps) => {
  const { label, name, options, style, ...otherProps } = props;
  const { register, getFieldState, formState } = useFormContext();
  const { error, invalid } = getFieldState(name, formState);

  return (
    // TODO: Usually I'd hook the label to the input with some generated ID
    // based on the name (instead of this nesting), but this is faster.
    <label>
      {label}
      <input
        {...otherProps}
        {...register(name, options)}
        style={{
          ...style,
          ...(invalid && {
            // TODO: Not use inline styles, obviously.
            outline: '1px solid red',
          }),
        }}
      />
      {error?.message}
    </label>
  );
};
