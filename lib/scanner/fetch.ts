const USER_AGENT =
  "Mozilla/5.0 (compatible; AIComplianceScanner/0.1; +https://github.com/varunvashisht1/ai-compliance)";

export interface FetchedPage {
  ok: boolean;
  status: number;
  finalUrl: string;
  html: string;
  headers: Record<string, string>;
  error?: string;
}

export async function fetchPage(rawUrl: string, timeoutMs = 15000): Promise<FetchedPage> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(rawUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await res.text();
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || rawUrl,
      html,
      headers,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      finalUrl: rawUrl,
      html: "",
      headers: {},
      error: err instanceof Error ? err.message : "Unknown fetch error",
    };
  } finally {
    clearTimeout(timer);
  }
}

export function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  try {
    const u = new URL(url);
    return u.toString();
  } catch {
    throw new Error(`Invalid URL: ${input}`);
  }
}
