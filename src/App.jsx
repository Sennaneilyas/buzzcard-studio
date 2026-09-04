import AppRouter from "@/app/AppRouter";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="bottom-right" />
    </>
  );
}
