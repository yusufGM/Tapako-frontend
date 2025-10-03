import { useSoldCount } from "./useSoldCount";
import useUserStore from "../../components/store/useUserStore.js";

export default function AdminHeader() {
  const { sold, loading } = useSoldCount();
  const logout = useUserStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-sm bg-black" />
          <span className="font-semibold tracking-tight">Tapako Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Products sold</span>
            <span className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
              {loading ? "…" : sold.toLocaleString()}
            </span>
          </div>
          <button
            onClick={logout}
            className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
