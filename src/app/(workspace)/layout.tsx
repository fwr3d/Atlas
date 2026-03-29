import { AuthenticatedAppShell } from "@/components/authenticated-app-shell";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedAppShell>{children}</AuthenticatedAppShell>;
}
