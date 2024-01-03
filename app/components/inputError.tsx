export function InputError({ error }: { error: string | undefined }) {
  return <>{error && <p className="text-red-500 text-sm !mt-2">{error}</p>}</>;
}
