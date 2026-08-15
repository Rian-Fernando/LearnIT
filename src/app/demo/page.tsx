import { redirect } from "next/navigation";

/** `/demo` is the entry point; the dashboard itself lives at `/demo/dashboard`
 *  so that navigation paths mirror the authenticated application exactly. */
export default function DemoRootPage() {
  redirect("/demo/dashboard");
}
