import { createBrowserRouter } from "react-router"
import AppLayout from "./App"
import HomePage from "./pages/home"
import ArchivesPage from "./pages/archives"
import ArticleDetailPage from "./pages/articles/$slug"
import CategoryPage from "./pages/categories/$slug"
import TagPage from "./pages/tags/$slug"
import SearchPage from "./pages/search"

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "articles/:slug",
        element: <ArticleDetailPage />,
      },
      {
        path: "categories/:slug",
        element: <CategoryPage />,
      },
      {
        path: "tags/:slug",
        element: <TagPage />,
      },
      { path: "archives", element: <ArchivesPage /> },
      { path: "search", element: <SearchPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
