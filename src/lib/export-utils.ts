/**
 * Universal document export utility for the SUDA Command Centre.
 * Generates and triggers actual browser downloads in official formats:
 * - HTML-based print-ready Government Memo (.html / Printable PDF)
 * - CSV / Excel spreadsheet (.csv)
 * - Rich formatted text document (.doc / .txt)
 */

export function downloadGovernmentMemo({
  title,
  memoNo = `SUDA/DIR/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
  scheme = "State Urban Development Agency (SUDA)",
  jurisdiction = "West Bengal",
  content,
  metadata = {},
  signatory = "Director, SUDA & Ex-Officio Joint Secretary"
}: {
  title: string;
  memoNo?: string;
  scheme?: string;
  jurisdiction?: string;
  content: string;
  metadata?: Record<string, string>;
  signatory?: string;
}) {
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const metadataRows = Object.entries(metadata)
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: 600; background: #f8fafc; width: 35%; color: #334155;">${k}</td>
        <td style="padding: 8px 12px; border: 1px solid #cbd5e1; color: #0f172a;">${v}</td>
      </tr>`
    )
    .join("");

  const formattedContent = content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin-bottom: 12px; line-height: 1.6; text-align: justify;">${p}</p>`)
    .join("");

  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${memoNo}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; font-size: 12pt; }
      .no-print { display: none; }
      @page { size: A4 portrait; margin: 15mm; }
    }
    body {
      font-family: 'Times New Roman', Times, serif, 'Noto Sans Bengali';
      color: #111827;
      background: #f1f5f9;
      margin: 0;
      padding: 40px 20px;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px 56px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 4px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .crest {
      font-size: 14px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #1e3a8a;
      margin-bottom: 4px;
    }
    .dept {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
    }
    .subhead {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
    }
    .memo-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 8px;
    }
    .title {
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      text-decoration: underline;
      margin: 20px 0;
      text-transform: uppercase;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
    }
    .signature {
      margin-top: 48px;
      float: right;
      text-align: center;
      width: 260px;
    }
    .sig-line {
      border-top: 1px solid #334155;
      padding-top: 8px;
      font-size: 13px;
      font-weight: bold;
    }
    .footer-seal {
      clear: both;
      margin-top: 60px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    .action-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      background: #1e3a8a;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    }
    .btn:hover { background: #1e40af; }
  </style>
</head>
<body>
  <div class="action-bar no-print">
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="page">
    <div class="header">
      <div class="crest">Government of West Bengal</div>
      <div class="dept">State Urban Development Agency (SUDA)</div>
      <div class="subhead">Department of Urban Development & Municipal Affairs<br>ILGUS Bhavan, HC-Block, Sector-III, Bidhannagar, Kolkata - 700106</div>
    </div>

    <div class="memo-meta">
      <div><strong>Memo No:</strong> ${memoNo}</div>
      <div><strong>Date:</strong> ${currentDate}</div>
    </div>

    <div class="title">${title}</div>

    <div style="font-size: 13px; margin-bottom: 16px;">
      <strong>Target Scheme / Domain:</strong> ${scheme}<br>
      <strong>Jurisdiction:</strong> ${jurisdiction}
    </div>

    ${
      metadataRows
        ? `<table>
        <thead>
          <tr><th colspan="2" style="background: #1e3a8a; color: white; padding: 6px 12px; text-align: left; font-size: 12px; text-transform: uppercase;">Technical / Audit Parameters</th></tr>
        </thead>
        <tbody>${metadataRows}</tbody>
      </table>`
        : ""
    }

    <div style="font-size: 13px;">
      ${formattedContent}
    </div>

    <div class="signature">
      <br><br>
      <div class="sig-line">
        (${signatory})<br>
        <span style="font-size: 11px; font-weight: normal; color: #475569;">State Urban Development Agency, GoWB</span>
      </div>
    </div>

    <div class="footer-seal">
      <span>Integrated Command & Control Centre (ICCC) — Authenticated Electronic Dispatch</span>
      <span>Generated via SUDA AI Core Engine</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDoc], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Downloads tabular data as an Excel-compatible CSV file with UTF-8 BOM.
 */
export function downloadCsvSpreadsheet({
  filename,
  headers,
  rows
}: {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  const sanitize = (val: string | number) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = "\uFEFF" + [
    headers.map(sanitize).join(","),
    ...rows.map((row) => row.map(sanitize).join(","))
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
