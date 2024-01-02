import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import { Container } from "~/components/container";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Response, type LoaderArgs } from "@remix-run/node";

export async function loader({ params }: LoaderArgs) {
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
    throw new Response("Not found", {
      status: 404,
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

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <Container>
        <h1>404</h1>
        <p>Essa coleção não existe.</p>
      </Container>
    );
  }

  throw new Error("Oops!");
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Container>
      <h1>Algo deu errado!</h1>
      <pre>{error.message}</pre>
    </Container>
  );
}
