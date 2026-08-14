export function FormField({
  label,
  name,
  optional = true,
  type = "text",
  placeholder,
  defaultValue,
  className = "",
}: {
  label: string;
  name: string;
  optional?: boolean;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-ink">
        {label}{" "}
        {optional && (
          <span className="font-normal text-ink-soft">(opcional)</span>
        )}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-ink"
      />
    </div>
  );
}
