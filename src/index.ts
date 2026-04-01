#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { calculate_shippingSchema, handleCalculateShipping } from "./tools/calculate-shipping.js";
import { track_packageSchema, handleTrackPackage } from "./tools/track-package.js";
import { get_delivery_timeSchema, handleGetDeliveryTime } from "./tools/get-delivery-time.js";
import { list_servicesSchema, handleListServices } from "./tools/list-services.js";
import { get_zip_codeSchema, handleGetZipCode } from "./tools/get-zip-code.js";
import { create_shipmentSchema, handleCreateShipment } from "./tools/create-shipment.js";
import { get_labelSchema, handleGetLabel } from "./tools/get-label.js";
import { cancel_shipmentSchema, handleCancelShipment } from "./tools/cancel-shipment.js";

const server = new McpServer({ name: "correios-mcp", version: "1.0.0" });

server.tool("calculate_shipping", "Calculate shipping cost", calculate_shippingSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCalculateShipping(params) }] }));
server.tool("track_package", "Track a package", track_packageSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleTrackPackage(params) }] }));
server.tool("get_delivery_time", "Get estimated delivery time", get_delivery_timeSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDeliveryTime(params) }] }));
server.tool("list_services", "List available postal services", list_servicesSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListServices(params) }] }));
server.tool("get_zip_code", "Get address from ZIP code", get_zip_codeSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetZipCode(params) }] }));
server.tool("create_shipment", "Create a shipment/pre-posting", create_shipmentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateShipment(params) }] }));
server.tool("get_label", "Get shipping label", get_labelSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetLabel(params) }] }));
server.tool("cancel_shipment", "Cancel a shipment", cancel_shipmentSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCancelShipment(params) }] }));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[correios-mcp] Server started. 8 tools available.");
}

main().catch((error) => { console.error("[correios-mcp] Error:", error); process.exit(1); });
