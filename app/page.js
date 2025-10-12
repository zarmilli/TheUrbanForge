"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        router.replace("/splash"); // ✅ go to home if signed in
      } else {
        router.replace("/splash"); // ✅ go to splash if not
      }
    };

    checkAuth();
  }, [router]);

  return null; // nothing to render while redirecting
}
