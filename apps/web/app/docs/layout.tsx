import { RscBoundaryProvider } from "rsc-boundary";
import { DocsPager } from "../../components/docs-pager";
import { DocsSidebar } from "../../components/docs-sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RscBoundaryProvider enabled>
      <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 sm:px-6">
        <DocsSidebar />
        <div className="min-w-0 flex-1">
          {children}
          <DocsPager />
        </div>
      </div>
    </RscBoundaryProvider>
  );
}
