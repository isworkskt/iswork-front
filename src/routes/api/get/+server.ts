import { error } from '@sveltejs/kit';
 
export async function GET({ url,platform }): Response {
    const x = await platform.env.iswork.get('balldata');
 
  return new Response(String(x));
}