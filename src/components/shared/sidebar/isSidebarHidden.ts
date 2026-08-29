const hiddenSidebarPaths = ["/chat-settings/visibility"];

export function isSidebarHidden(pathname: string) {
  return hiddenSidebarPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
