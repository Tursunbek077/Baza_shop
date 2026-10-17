// Supabase Edge Function — send-telegram
// Deno runtime muhitida ishlaydi
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Faqat POST so‘rovi ruxsat etilgan' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      return new Response(
        JSON.stringify({ ok: false, error: 'TELEGRAM_BOT_TOKEN muhit o‘zgaruvchisi topilmadi' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { text, chatId, parse_mode = 'HTML' } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Xabar matni (text) kiritilmagan' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawChatIds = chatId || Deno.env.get('TELEGRAM_CHAT_ID');
    if (!rawChatIds) {
      return new Response(
        JSON.stringify({ ok: false, error: 'TELEGRAM_CHAT_ID topilmadi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetChatIds = String(rawChatIds)
      .split(/[,;\s]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    const results = await Promise.allSettled(
      targetChatIds.map(async (targetId) => {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetId,
            text,
            parse_mode,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.description || `HTTP ${response.status}`);
        }
        return data;
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    if (successful.length === 0) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: failed[0]?.reason?.message || 'Xatolik',
          details: failed.map((f) => f.reason?.message),
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, totalSent: successful.length, failedCount: failed.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message || 'Server xatoligi' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
