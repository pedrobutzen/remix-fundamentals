import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import { Container } from "~/components/container";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { prisma } from "~/db.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const collection = await prisma.collection.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      id: true,
      name: true,
      description: true,
      articles: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
  });

  if (!collection) {
    throw new Response(null, {
      status: 404,
      statusText: "Collection not found",
    });
  }

  return { collection };
}

export default function Index() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div>
      <Container className="py-10 space-y-8">
        <Breadcrumb>
          <BreadcrumbItem to="/">Página Inicial</BreadcrumbItem>
          <BreadcrumbItem to={`/collections/${collection?.id}`}>
            {collection?.name}
          </BreadcrumbItem>
        </Breadcrumb>

        {collection?.articles.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            className="w-full bg-slate-50 shadow rounded-sm p-6 block"
            key={article.id}
          >
            <h2 className="text-xl text-slate-900">{article.title}</h2>
            <p className="text-slate-400 mt-1">{article.description}</p>
          </Link>
        ))}
      </Container>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Container>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Algo deu errado!</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </Container>
  );
}
