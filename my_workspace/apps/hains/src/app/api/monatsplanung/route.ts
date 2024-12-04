export async function GET(request: Request) {
  return new Response(JSON.stringify({}), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
