import { Container } from "~/components/container";
import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { prisma } from "~/db.server";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { z } from "zod";
import { InputError } from "~/components/inputError";
import { validationAction } from "~/utils";

const ArticleSchema = z
  .object({
    title: z.string({ required_error: "Title is required" }).trim(),
    content: z
      .string({ required_error: "Content is required" })
      .trim()
      .min(1, "Content is required"),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(1, "Description is required"),
    collectionId: z
      .string({ required_error: "Select a collection" })
      .trim()
      .min(1, "Select a collection"),
  })
  .required();
type ArticleInput = z.infer<typeof ArticleSchema>;

export async function action({ request }: ActionFunctionArgs) {
  const { formData, errors } = await validationAction<ArticleInput>({
    request,
    schema: ArticleSchema,
  });

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  const { id } = await prisma.article.create({
    data: {
      title: formData.title,
      description: formData.description,
      content: formData.content,
      collectionId: Number(formData.collectionId),
    },
  });

  return redirect(`/articles/${id}`);
}

export async function loader() {
  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return { collections };
}

export default function Index() {
  const { collections } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div>
      <Container className="py-10">
        <Breadcrumb>
          <BreadcrumbItem to="/">Página Inicial</BreadcrumbItem>
          <BreadcrumbItem to="/articles/new">Novo Artigo</BreadcrumbItem>
        </Breadcrumb>
      </Container>

      <Container className="prose">
        <h1>Novo Artigo</h1>

        <Form
          method="post"
          className="flex flex-col bg-slate-50 p-6 rounded-md"
        >
          <fieldset disabled={isLoading} className="space-y-6">
            <input
              type="text"
              name="title"
              placeholder="Título"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <InputError error={actionData?.errors?.title} />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <InputError error={actionData?.errors?.description} />
            <textarea
              name="content"
              placeholder="Content"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            />
            <InputError error={actionData?.errors?.content} />
            <select
              name="collectionId"
              className="block w-full px-4 rounded-md py-3 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:text-slate-900 focus:outline-none"
            >
              <option value="">Selecione uma collection</option>
              {collections?.map((collection) => (
                <option value={collection.id} key={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <InputError error={actionData?.errors?.collectionId} />
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                {isLoading ? "Loading..." : "Salvar"}
              </button>
            </div>
          </fieldset>
        </Form>
      </Container>
    </div>
  );
}
