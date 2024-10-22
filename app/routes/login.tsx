import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { SubmitButton } from "../components/submit-button";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { createClient } from "~/utils/supabase/.server/server";

export const loader = async ({
    request,
}: LoaderFunctionArgs) => {

    const { searchParams } = new URL(request.url);
    const message = searchParams.get("message");

    return json({
        message
    });
};

export default function Login() {

    const { message } = useLoaderData<typeof loader>()
    const navigation = useNavigation()

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                to="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{" "}
                Back
            </Link>

            <Form method="post" className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <label className="text-md" htmlFor="password">
                    Password
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <SubmitButton
                    name="intent"
                    value="signin"
                    isPending={navigation.formData?.get("intent") === 'signin'}
                    className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
                    pendingText="Signing In..."
                >
                    Sign In
                </SubmitButton>
                <SubmitButton
                    name="intent"
                    value="signup"
                    isPending={navigation.formData?.get("intent") === 'signup'}
                    className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
                    pendingText="Signing Up..."
                >
                    Sign Up
                </SubmitButton>
                {message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {message}
                    </p>
                )}
            </Form>
        </div>
    );
}

export async function action({
    request,
}: ActionFunctionArgs) {
    const formData = await request.formData()
    const intent = formData.get("intent") as string;

    const { supabase, headers } = createClient(request)

    if (intent === 'signup') {
        const origin = request.headers.get('origin')
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/login?message=Check email to continue sign in process");
    } else if (intent === 'signin') {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/protected", { headers });
    }

    throw () => {
        return new Response(`Unknown intent: ${intent}`, {
            status: 400,
            statusText: "Bad Request",
        });
    }
}
