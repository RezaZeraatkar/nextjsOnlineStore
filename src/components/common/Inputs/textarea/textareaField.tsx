interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  id: string;
  label: string;
  error: string | null;
}

export const TextAreaField: React.FC<TextAreaProps> = ({
  id,
  label,
  error,
  ...props
}) => (
  <>
    <label htmlFor={id}>
      {label} <span className='text-red-500'>{error || null}</span>
    </label>
    <textarea id={id} {...props} />
  </>
);
