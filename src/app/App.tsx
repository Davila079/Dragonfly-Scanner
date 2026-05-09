import { RouterProvider } from "react-router";
import { router } from "./routes";
import { UserProvider } from "./components/user-context";

export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
