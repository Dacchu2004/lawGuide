import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <div className="w-64 border-r border-slate-800 p-4">
        <p className="font-bold">{user?.email}</p>
        <p className="text-sm text-slate-400">
          {user?.state} · {user?.language}
        </p>

        <button
          onClick={logout}
          className="mt-6 bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center text-slate-500">
        Dashboard Under Construction
      </div>
    </div>
  );
}
