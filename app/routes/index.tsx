import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Container } from "~/components/container";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const query = new URL(request.url).searchParams.get("q") as string;
  const isSearching = !!query;

  const articles = isSearching
    ? await prisma.article.findMany({
        where: {
          title: {
            contains: query,
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
        },
      })
    : [];

  const collections = await prisma.collection.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return {
    collections,
    isSearching,
    searchResult: articles,
  };
}

export default function Index() {
  const { collections, isSearching, searchResult } =
    useLoaderData<typeof loader>();

  const searchItems = searchResult.map((article, _) => (
    <Link
      to={`/articles/${article.id}`}
      className="w-full bg-slate-50 shadow rounded-sm p-6 block"
      key={article.id}
    >
      <h2 className="text-xl text-slate-900">{article.title}</h2>
      <p className="text-slate-400 mt-1">{article.description}</p>
    </Link>
  ));

  return (
    <div>
      <Container className="py-10 space-y-8">
        {isSearching ? (
          <div>
            <h1 className="text-3xl mb-4">Resultado da busca:</h1>
            {searchItems.length ? searchItems : <p>Nenhum artigo encontrado</p>}
          </div>
        ) : (
          collections.map((collection) => (
            <Link
              to={`/collections/${collection.id}`}
              className="w-full bg-slate-50 shadow rounded-sm p-6 block"
              key={collection.id}
            >
              <h2 className="text-xl text-slate-900">{collection.name}</h2>
              <p className="text-slate-400 mt-1">{collection.description}</p>
            </Link>
          ))
        )}
      </Container>
    </div>
  );
}
