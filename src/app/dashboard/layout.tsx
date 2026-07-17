import DashboardShell from "@/components/dashboard/DashboardShell";
import Breadcrumb from "@/components/dashboard/BreadCrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      <Breadcrumb />
      {children}
    </DashboardShell>
  );
}