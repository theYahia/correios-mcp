import { z } from "zod";
import { CorreiosClient } from "../client.js";

const client = new CorreiosClient();

export const cancel_shipmentSchema = z.object({
  shipment_id: z.string().describe("Shipment ID"),
});

export async function handleCancelShipment(params: z.infer<typeof cancel_shipmentSchema>): Promise<string> {
  const result = await client.request("DELETE", `/prepostagem/v1/prepostagens/${params.shipment_id}`);
  return JSON.stringify(result, null, 2);
}
