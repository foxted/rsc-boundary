import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-muted">
          Documentation for{" "}
          <span className="font-medium text-foreground">RSC Boundary</span>.
          Toggle the RSC pill to highlight server vs client regions.
        </p>
        <div className="flex gap-4 text-sm">
          <Link href="/docs" className="text-muted hover:text-foreground">
            Docs
          </Link>
          <Link href="/docs/examples" className="text-muted hover:text-foreground">
            Examples
          </Link>
        </div>
      </div>
    </footer>
  );
}
