import { createBrowserRouter } from "react-router"
import AppLayout from "./App"
import HomePage from "./pages/home"
import ArchivesPage from "./pages/archives"
import ArticleDetailPage from "./pages/articles/$slug"
import CategoryPage from "./pages/categories/$slug"
import TagPage from "./pages/tags/$slug"
import SearchPage from "./pages/search"
import { AdminLayout } from "./components/admin/Layout"
import { PrivateRoute } from "./components/admin/PrivateRoute"
import { AdminLoginPage } from "./pages/admin/login"
import { ArticleListPage } from "./pages/admin/articles/list"
import { ArticleEditorPage } from "./pages/admin/articles/editor"
import { CategoriesPage } from "./pages/admin/categories"
import { TagsPage } from "./pages/admin/tags"
import { DashboardPage } from "./pages/admin/dashboard"
import { VisitsPage } from "./pages/admin/visits"

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
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "articles", element: <ArticleListPage /> },
      { path: "articles/new", element: <ArticleEditorPage /> },
      { path: "articles/:id/edit", element: <ArticleEditorPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "visits", element: <VisitsPage /> },
    ],
  },
  { path: "/admin/login", element: <AdminLoginPage /> },
]

export const router = createBrowserRouter(routes)
