import { redirect } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useLoaderData } from "./root";

export async function loader() {
  const sessionResult = await supabase.auth.getSession();
  if (sessionResult.data.session === null) {
    return redirect("/auth");
  }

  return null;
}

export default function Workspaces() {
  const loaderData = useLoaderData();

  return <h1>Workspaces</h1>;
}
