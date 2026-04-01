# correios-mcp

MCP server for Correios Brazilian postal service.

## Tools (8)

| Tool | Description |
|---|---|
| `calculate_shipping` | Calculate shipping cost |
| `track_package` | Track a package |
| `get_delivery_time` | Get estimated delivery time |
| `list_services` | List available postal services |
| `get_zip_code` | Get address from ZIP code |
| `create_shipment` | Create a shipment/pre-posting |
| `get_label` | Get shipping label |
| `cancel_shipment` | Cancel a shipment |

## Quick Start

```json
{
  "mcpServers": {
    "correios": {
      "command": "npx",
      "args": ["-y", "@theyahia/correios-mcp"],
      "env": {
        "CORREIOS_USER": "<YOUR_CORREIOS_USER>",
        "CORREIOS_TOKEN": "<YOUR_CORREIOS_TOKEN>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CORREIOS_USER` | Yes | Correios username |
| `CORREIOS_TOKEN` | Yes | Correios API token |

## License

MIT
