import { createBrowserRouter } from "react-router";
import { NavLayout } from "./components/nav-layout";
import { DashboardPage } from "./components/dashboard-page";
import { ScanFlow } from "./components/scan-flow";
import { CollectionPage } from "./components/collection-page";
import { CommunityPage } from "./components/community-page";
import { LearnPage } from "./components/learn-page";
import { ProfilePage } from "./components/profile-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NavLayout>
        <DashboardPage />
      </NavLayout>
    ),
  },
  {
    path: "/scan/*",
    element: (
      <NavLayout>
        <ScanFlow />
      </NavLayout>
    ),
  },
  {
    path: "/collection",
    element: (
      <NavLayout>
        <CollectionPage />
      </NavLayout>
    ),
  },
  {
    path: "/community",
    element: (
      <NavLayout>
        <CommunityPage />
      </NavLayout>
    ),
  },
  {
    path: "/learn",
    element: (
      <NavLayout>
        <LearnPage />
      </NavLayout>
    ),
  },
  {
    path: "/profile",
    element: (
      <NavLayout>
        <ProfilePage />
      </NavLayout>
    ),
  },
  {
    path: "*",
    element: (
      <NavLayout>
        <DashboardPage />
      </NavLayout>
    ),
  },
]);
