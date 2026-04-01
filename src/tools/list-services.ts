import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const list_servicesSchema = z.object({

});

export async function handleListServices(params: z.infer<typeof list_servicesSchema>): Promise<string> {
  const result = await client.request("GET", "/servicos/v1/servicos");
  return JSON.stringify(result, null, 2);
}
