import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { readDestination, rememberDestination } from "@/lib/auth";

function routeIds(path: string) {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  return router.matchRoutes(path).map((match) => match.routeId);
}

const behindSignIn = (path: string) => routeIds(path).some((id) => id.endsWith("_authenticated"));

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("keeps browsing open while personal pages sit behind the sign-in layout", () => {
    expect(behindSignIn("/")).toBe(false);
    expect(behindSignIn("/item/mini-fridge")).toBe(false);
    expect(behindSignIn("/auth")).toBe(false);

    for (const path of ["/saved", "/my-listings", "/messages", "/sell", "/profile"]) {
      expect(behindSignIn(path)).toBe(true);
    }
  });
});

describe("Post-sign-in destination", () => {
  it("sends the student back to the page they were blocked from, once", () => {
    rememberDestination("/my-listings");
    expect(readDestination()).toBe("/my-listings");
    expect(readDestination()).toBeNull();
  });

  it("refuses a destination that is not one of the app's own gated pages", () => {
    rememberDestination("//evil.example.com/steal");
    expect(readDestination()).toBeNull();

    rememberDestination("/dashboard");
    expect(readDestination()).toBeNull();
  });
});
