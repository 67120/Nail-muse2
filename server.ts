import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend - use hardcoded key for immediate user request, 
// though normally we'd rely on process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "re_KBvf61Ew_BEveENC7ejzdJBvZLN5mFgeB");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/notify-click", async (req, res) => {
    const { email, type } = req.body;
    console.log(`[NAIL MUSE ALERT] User clicked ${type}. Target Email: ${email || 'Anonymous'}`);
    
    try {
      const isEmailCapture = type === 'EMAIL_CAPTURE';
      const now = new Date();
      const timestamp = now.toLocaleString('bg-BG', { 
        timeZone: 'Europe/Sofia',
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });

      const subject = isEmailCapture 
        ? `✨ НОВ ЛИЙД: ${email}` 
        : `💖 ИНТЕРЕС: Кликнат бутон "КУПИ"`;

      const text = isEmailCapture
        ? `Вие имате нов заинтересован клиент!\n\nИмейл: ${email}\nДействие: Сподели имейл след съобщение за изчерпана наличност.\nТочен час: ${timestamp}\n\nПроверете във вашия Firebase за всички записи.`
        : `Потенциален клиент току-що кликна на бутона "КУПИ СЕГА".\n\nДействие: Клик върху бутона Купи\nТочен час: ${timestamp}`;

      await resend.emails.send({
        from: 'Nail Muse <onboarding@resend.dev>',
        to: 'gdzhaferova@gmail.com',
        subject: subject,
        text: text,
      });

      console.log(`Notification sent to gdzhaferova@gmail.com: Someone clicked ${type} at ${timestamp}`);
      res.json({ success: true, message: "Notification sent via Resend." });
    } catch (error) {
      console.error("Failed to send email via Resend:", error);
      res.status(500).json({ success: false, message: "Failed to send notification email." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
