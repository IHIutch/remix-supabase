import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, Link, redirect, useLoaderData } from "@remix-run/react";
import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

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

    return json({
        user
    }, {
        headers
    });
};

export default function AuthButton() {
    const { user } = useLoaderData<typeof loader>()


    return user ? (
        <div className="flex items-center gap-4">
            Hey, {user.email}!
            <Form method="post" action="resource/auth-button">
                <button type="submit" className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                    Logout
                </button>
            </Form>
        </div>
    ) : (
        <Link
            to="/login"
            className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            Login
        </Link>
    );
}


export async function action({
    request,
}: ActionFunctionArgs) {

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

    await supabase.auth.signOut();
    return redirect("/login");
}
