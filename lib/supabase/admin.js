import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function buatKlienAdmin() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll dipanggil dari Server Component — abaikan error.
            // Cookie tetap akan di-set dari Server Action atau Route Handler.
          }
        },
      },
    }
  );
}

