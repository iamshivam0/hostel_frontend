"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, hasRole } from "@/app/utils/auth";

export default function HostelAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!hasRole(["admin"])) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
