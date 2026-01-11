import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";
import { Suspense } from "react";

async function ProtectedDashboard() {

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <DashboardClient />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <ProtectedDashboard />
    </Suspense>
  );
}
