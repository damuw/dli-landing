# DLI region resolver Worker

`region.js` is a single-purpose Cloudflare Worker that serves `/region.js`:

```js
window.DLI_REGION="us";window.DLI_REGION_SOURCE="edge";
```

The landing page loads it synchronously in `<head>` before the Design Component
runtime, so the four regional copy packs render on first paint.

## Routing

Add two Worker routes, both exact:

- `deeplearningintelligence.com/region.js*`
- `www.deeplearningintelligence.com/region.js*`

Do **not** route `/*` — the Worker must not touch HTML or assets.

## Resolution

| Condition | Region |
| --- | --- |
| `?region=ae\|gcc\|us\|global` | that region (QA override) |
| Known crawler UA | `ae` (indexed page matches the primary market) |
| `CF-IPCountry = AE` | `ae` |
| `SA, QA, KW, BH, OM` | `gcc` |
| `US` | `us` |
| Everything else / unknown | `global` |

No IP is logged or stored. The response is `no-store`, so a country-specific
script is never cached and served to another country.

## Deploy status

Live as `dli-region`, deployed with `npx wrangler deploy` using `wrangler.toml` at the repo
root. The two routes were created by that deploy. Re-run `npx wrangler deploy` after editing
`workers/region.js`.

## Deploy (dashboard, alternative)

1. Cloudflare dashboard → Workers & Pages → Create → Worker.
2. Name `dli-region`, deploy the default, then Edit code and paste `region.js`.
3. Deploy.
4. Settings → Triggers → Add route for both hostnames above.
5. Verify:
   ```bash
   curl -s https://deeplearningintelligence.com/region.js
   # window.DLI_REGION="ae";...
   curl -s "https://deeplearningintelligence.com/region.js?region=us"
   # window.DLI_REGION="us";...
   ```
6. Open `https://deeplearningintelligence.com/?region=us` and confirm the US hero
   and Why-now pack.

## Rollback

Remove the two routes. The origin `site/region.js` fallback immediately serves
`window.DLI_REGION = "ae"`, so the page still works with the UAE default and the
manual selector.
