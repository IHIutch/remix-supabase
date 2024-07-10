import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import DeployButton from "~/components/deploy-button";
import Header from "~/components/header";
import ConnectSupabaseSteps from "~/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "~/components/tutorial/sign-up-user-steps";
import AuthButton from "./resource.auth-button";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const canInitSupabaseClient = () => {
    const headers = new Headers()

    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
        cookies: {
          getAll() {
            return parseCookieHeader(request.headers.get('Cookie') ?? '')
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              headers.append('Set-Cookie', serializeCookieHeader(name, value, options))
            )
          },
        },
      })
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return json({
    isSupabaseConnected
  });
};

export default function Index() {

  const { isSupabaseConnected } = useLoaderData<typeof loader>()


  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <DeployButton />
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
      </footer>
    </div>
  );
}
