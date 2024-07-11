import { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, redirect } from "@remix-run/react";
import { User } from "@supabase/supabase-js";
import { createClient } from "~/utils/supabase/.server/server";

export default function AuthButton({ user }: { user?: User }) {

    return user ? (
        <div className="flex items-center gap-4">
            Hey, {user.email}!
            <Form method="post" action="/resource/auth-button">
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

    const { supabase } = createClient(request)

    await supabase.auth.signOut();
    return redirect("/login");
}
