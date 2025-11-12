
import type { Metadata } from "next";
import { FormMessage } from "./client";
export const metadata: Metadata = {
  title: "GhostTaks - Send Anonymous Message",
};
export default async function Page(props: PageProps<"/letter/[id]">) {
  const { id } = await props.params;
  return <FormMessage id={id} />;
}
