import { Form, Link, useNavigation } from "@remix-run/react";
import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { Container } from "./container";

export function Hero({ showTitle = true }) {
  const navigation = useNavigation();
  const q = new URLSearchParams(navigation.location?.search).get("q");

  return (
    <div className="bg-slate-50">
      <Container>
        <header>
          <nav aria-label="Top">
            <div className="w-full py-6 flex items-center justify-between border-b border-slate-200 lg:border-none">
              <Link to="/" className="flex items-center">
                <span className="sr-only">Help Center</span>
                <img className="h-10 w-auto" src="/logo.png" alt="" />
                <div className="hidden ml-6 space-x-8 lg:block">
                  <p className="text-lg font-medium">Central de Ajuda</p>
                </div>
              </Link>
              <div className="ml-10 space-x-6 flex items-center">
                <a
                  href="https://codersclub.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary inline-flex items-center"
                >
                  <ArrowTopRightOnSquareIcon className="mr-2 w-[1rem] h-[1rem]">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </ArrowTopRightOnSquareIcon>
                  Ir para CodersClub
                </a>
                <Link
                  to="/articles/new"
                  className="text-sm font-medium hover:text-primary"
                >
                  Novo artigo
                </Link>
              </div>
            </div>
          </nav>
        </header>

        <div className="pb-6">
          {showTitle && (
            <h1 className="text-4xl font-light my-6">
              Dicas e respostas da Coders Club
            </h1>
          )}

          <Form
            className="relative rounded-md shadow-sm inline-flex items-center w-full"
            action="/"
            method="get"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-6 w-6 text-slate-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="q"
              id="search"
              key={q}
              defaultValue={q || ""}
              className="block w-full pl-14 rounded-md py-4 text-slate-900 bg-white ring-1 ring-slate-200 transition-colors text-lg focus:outline-none"
              placeholder="Buscar por artigos"
            />
          </Form>
        </div>
      </Container>
    </div>
  );
}
