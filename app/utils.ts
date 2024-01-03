import type { ZodError, ZodIssue, ZodSchema } from "zod";

type ActionErrors<T> = Partial<Record<keyof T, string>>;

export async function validationAction<ActionInput>({
  request,
  schema,
}: {
  request: Request,
  schema: ZodSchema
}) {
  const payload = Object.fromEntries(await request.formData());

  try {
    const formData = schema.parse(payload) as ActionInput;

    return {
      formData,
      errors: null,
    };
  } catch (e) {
    const errors = e as ZodError<ActionInput>;

    return {
      formData: null,
      errors: errors.issues.reduce((errors: ActionErrors<ActionInput>, issue: ZodIssue) => {
        const fieldName = issue.path[0] as keyof ActionInput;

        errors[fieldName] = issue.message;

        return errors;
      }, {}),
    };
  }
}
