import { openApiDocument } from "./openapi.js";

export function openApi(req, res) {
  return res.json(openApiDocument);
}

export function apiDocs(req, res) {
  const groups = Object.entries(openApiDocument.paths)
    .flatMap(([path, methods]) =>
      Object.entries(methods).map(([method, operation]) => ({
        method: method.toUpperCase(),
        path,
        summary: operation.summary,
        tag: operation.tags[0]
      }))
    )
    .reduce((result, item) => {
      result[item.tag] ??= [];
      result[item.tag].push(item);
      return result;
    }, {});

  const sections = Object.entries(groups)
    .map(
      ([tag, items]) => `
        <section>
          <h2>${tag}</h2>
          ${items
            .map(
              (item) => `
                <div class="route">
                  <code class="${item.method.toLowerCase()}">${item.method}</code>
                  <strong>${item.path}</strong>
                  <span>${item.summary}</span>
                </div>`
            )
            .join("")}
        </section>`
    )
    .join("");

  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ChillPlace API</title>
  <style>
    body { max-width: 1080px; margin: 40px auto; padding: 0 20px; font: 15px system-ui; color: #172033; }
    header { margin-bottom: 32px; }
    a { color: #6d28d9; }
    section { margin: 28px 0; }
    .route { display: grid; grid-template-columns: 76px minmax(240px, 1fr) 1.5fr; gap: 12px; padding: 10px 0; border-bottom: 1px solid #e5e7eb; align-items: center; }
    code { color: white; padding: 5px 8px; border-radius: 5px; text-align: center; font-weight: 700; }
    .get { background: #2563eb; } .post { background: #059669; } .patch { background: #d97706; } .delete { background: #dc2626; }
    @media (max-width: 700px) { .route { grid-template-columns: 70px 1fr; } .route span { grid-column: 2; } }
  </style>
</head>
<body>
  <header>
    <h1>ChillPlace API v${openApiDocument.info.version}</h1>
    <p>${openApiDocument.info.description}</p>
    <p><a href="/api/docs/openapi.json">Download OpenAPI 3.0 JSON</a></p>
  </header>
  ${sections}
</body>
</html>`);
}
