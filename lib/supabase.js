export const supabase = null;

export async function testConnection() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${base}/resources.php`);
    return res.ok;
  } catch (e) {
    return false;
  }
}
