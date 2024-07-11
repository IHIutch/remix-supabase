import Code from "./code";
import Step from "./step";


const create = `
create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('Today I created a Supabase project.'),
  ('I added some data and queried it from Remix.'),
  ('It was awesome!');
`.trim();

const server = `
import { createClient } from "~/utils/supabase/.server/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createClient(request)
  const { data: notes } = await supabase.from('notes').select()

  return { notes }
};

export default async function Page() {
  const { user } = useLoaderData<typeof loader>()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `
import { createClient } from "~/utils/supabase/client";
import { useEffect, useState } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    env: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
};

export default function Page() {
  const { env } = useLoaderData<typeof loader>();
    
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export default function FetchDataSteps() {
    return (
        <ol className="flex flex-col gap-6">
            <Step title="Create some tables and insert some data">
                <p>
                    Head over to the{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/editor"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Table Editor
                    </a>{" "}
                    for your Supabase project to create a table and insert some example
                    data. If you&apos;re stuck for creativity, you can copy and paste the
                    following into the{" "}
                    <a
                        href="https://supabase.com/dashboard/project/_/sql/new"
                        className="font-bold hover:underline text-foreground/80"
                        target="_blank"
                        rel="noreferrer"
                    >
                        SQL Editor
                    </a>{" "}
                    and click RUN!
                </p>
                <Code code={create} />
            </Step>

            <Step title="Query Supabase data from Remix">
                <p>
                    To create a Supabase client and query data from an Async Server
                    Component, create a new page.tsx file at{" "}
                    <span className="px-2 py-1 rounded-md bg-foreground/20 text-foreground/80">
                        /app/notes/page.tsx
                    </span>{" "}
                    and add the following.
                </p>
                <Code code={server} />
                <p>Alternatively, you can use a Client Component.</p>
                <Code code={client} />
            </Step>

            <Step title="Build in a weekend and scale to millions!">
                <p>You&apos;re ready to launch your product to the world! 🚀</p>
            </Step>
        </ol>
    );
}
