type InputErrorProps = {
  errors?: Array<string>;
};

export function InputError({ errors }: InputErrorProps) {
  return (
    <>
      {errors?.length &&
        errors.map((error, i) => (
          <p className="text-red-500 text-sm !mt-2" key={i}>
            {error}
          </p>
        ))}
    </>
  );
}
