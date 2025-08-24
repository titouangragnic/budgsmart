async function getRuntimeConfig(): Promise<{ API_BASE_URL: string }> {
  const res = await fetch('/budgsmart/config.json');
  return res.json();
}


export async function getApiBaseUrl(): Promise<string> {
  const config = await getRuntimeConfig();
  return config.API_BASE_URL;
}