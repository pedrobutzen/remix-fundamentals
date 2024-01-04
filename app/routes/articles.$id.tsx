import { Container } from "~/components/container";
import { Breadcrumb, BreadcrumbItem } from "~/components/breadcrumb";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/db.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const article = await prisma.article.findUnique({
    where: {
      id: Number(params.id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      collection: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return { article };
}

export default function Index() {
  const { article } = useLoaderData<typeof loader>();

  return (
    <div>
      <Container className="py-10">
        <Breadcrumb>
          <BreadcrumbItem to="/">Página Inicial</BreadcrumbItem>
          <BreadcrumbItem to={`/collections/${article?.collection?.id}`}>
            {article?.collection?.name}
          </BreadcrumbItem>
          <BreadcrumbItem to={`/articles/${article?.id}`}>
            {article?.title}
          </BreadcrumbItem>
        </Breadcrumb>
      </Container>

      <Container className="prose">
        <h1>{article?.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article?.content as string }} />
      </Container>
    </div>
  );
}
