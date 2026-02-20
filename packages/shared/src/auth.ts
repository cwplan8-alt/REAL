export type MockUser = { id: string; email: string; app_id: "A" | "B" };

export function sessionCookieName(appId: "A" | "B") {
  return appId === "A" ? "feasibility_user" : "stylesearch_user";
}
