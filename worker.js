Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/go") {
    const ip = req.headers.get("x-forwarded-for") || "неизвестно";
    const ua = req.headers.get("user-agent") || "неизвестно";
    const country = req.headers.get("x-deno-country") || "неизвестно";
    const city = req.headers.get("x-deno-city") || "неизвестно";

    const RESEND_KEY = Deno.env.get("RESEND_KEY");
    const TO_EMAIL = Deno.env.get("TO_EMAIL");

    const html = `
      <h2>🔔 Переход по ссылке</h2>
      <p><b>IP:</b> ${ip}</p>
      <p><b>Страна:</b> ${country}</p>
      <p><b>Город:</b> ${city}</p>
      <p><b>Устройство:</b> ${ua}</p>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: TO_EMAIL,
        subject: "🔔 Кто-то перешёл по ссылке",
        html: html
      })
    });

    return Response.redirect("https://ya.ru", 302);
  }

  return new Response("ok");
});
