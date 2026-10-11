// Shell for the "centered card" layout from docs/site-tree.md:
// a single card in the middle of the screen, no navigation.
export function CenteredCardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-muted/40 p-4">
      {children}
    </div>
  );
}
