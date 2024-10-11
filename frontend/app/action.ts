"use server";

import { z } from "zod";

const formSchema = z.record(z.string());

export async function submitDemographicForm(data: z.infer<typeof formSchema>) {
  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const res = await fetch(`${apiUrl}/api/assessment/classify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to submit demographic form");
  }

  return res.json();
}
