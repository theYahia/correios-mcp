import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const get_zip_codeSchema = z.object({
  cep: z.string().describe("Brazilian ZIP code (CEP)"),
});

export async function handleGetZipCode(params: z.infer<typeof get_zip_codeSchema>): Promise<string> {
  const result = await client.request("GET", `/cep/v2/enderecos/${params.cep}`);
  return JSON.stringify(result, null, 2);
}
