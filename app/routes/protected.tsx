// import DeployButton from "@/components/DeployButton";
// import AuthButton from "@/components/AuthButton";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import DeployButton from "../components/deploy-button";
import FetchDataSteps from "../components/tutorial/fetch-data-steps";
import Header from "../components/header";
import AuthButton from "./resource.auth-button";

export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    const headers = new Headers()

    const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
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


    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    return json({
        user
    }, {
        headers
    });
};



export default function ProtectedPage() {

    const { user } = useLoaderData<typeof loader>()

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="w-full">
                <div className="py-6 font-bold bg-purple-950 text-center">
                    This is a protected page that you can only see as an authenticated
                    user
                </div>
                <div>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                        <DeployButton />
                        <AuthButton />
                    </div>
                </nav>
            </div>

            <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
                <Header />
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4">Next steps</h2>
                    <FetchDataSteps />
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
