import type { Metadata } from "next";
import AdminPanel from "@/components/admin/AdminPanel";
import { getLocations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin | Alternatif Turizm Devremülk Merkezi",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminPanel locations={locations} />
    </div>
  );
}
