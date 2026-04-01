import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const get_labelSchema = z.object({
  shipment_id: z.string().describe("Shipment ID"),
});

export async function handleGetLabel(params: z.infer<typeof get_labelSchema>): Promise<string> {
  const result = await client.request("GET", `/prepostagem/v1/prepostagens/${params.shipment_id}/rotulo`);
  return JSON.stringify(result, null, 2);
}
