export const API_BASE = 'http://localhost:4000'

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export const http = {
  get: <T>(path: string, params?: Record<string, unknown>) => {
    const url = new URL(API_BASE + path)
    if (params) Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, String(vv)))
      else url.searchParams.set(k, String(v))
    })
    return request<T>(url.toString())
  },
  post: <T>(path: string, body: unknown) =>
    request<T>(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
}


