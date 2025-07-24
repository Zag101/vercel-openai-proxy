export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { model, messages } = req.body;

  if (!model || !messages) {
    return res.status(400).json({ error: "Missing model or messages" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      res.send(data.choices[0].message.content);
    } else {
      res.status(500).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
