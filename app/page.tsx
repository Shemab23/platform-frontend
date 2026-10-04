"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<unknown>(null);
  useEffect(() => {
    fetch("/api/tenant/config", { headers: { "x-tenant": "shop-a" } })
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setData({ error: String(e) }));
  }, []);
  //  hello
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Platform</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
