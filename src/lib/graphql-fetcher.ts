const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

export function fetcher<TData, TVariables>(
  query: string,
  variables?: TVariables,
): () => Promise<TData> {
  return async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // JWT token varsa otomatik ekle
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      const message = json.errors
        .map((e: { message: string }) => e.message)
        .join(', ');

      // Auth hataları — token'ı temizle ve login'e yönlendir
      if (message.includes('Unauthorized')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      throw new Error(message);
    }

    return json.data;
  };
}
