(() => {
  "use strict";

  // Fixed global target: 16 Dec 2026, 09:00 Afghanistan time (UTC+04:30) = 04:30 UTC.
  const TARGET_TIME = Date.parse("2026-12-16T04:30:00Z");
  const MESSAGE_DURATION_MS = 10 * 60 * 60 * 1000;

  const box = document.getElementById("countdownBox");
  const grid = document.getElementById("timerGrid");
  const finished = document.getElementById("timerFinished");
  const caption = document.getElementById("timerCaption");
  const parts = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  const twoDigits = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const now = Date.now();
    const remaining = TARGET_TIME - now;

    if (remaining > 0) {
      const totalSeconds = Math.floor(remaining / 1000);
      parts.days.textContent = String(Math.floor(totalSeconds / 86400)).padStart(2, "0");
      parts.hours.textContent = twoDigits(Math.floor((totalSeconds % 86400) / 3600));
      parts.minutes.textContent = twoDigits(Math.floor((totalSeconds % 3600) / 60));
      parts.seconds.textContent = twoDigits(totalSeconds % 60);
      grid.hidden = false;
      finished.hidden = true;
      caption.hidden = false;
      return;
    }

    if (now < TARGET_TIME + MESSAGE_DURATION_MS) {
      grid.hidden = true;
      finished.hidden = false;
      caption.hidden = true;
      return;
    }

    // After 10 hours from the target, hide the entire timer card.
    box.hidden = true;
  }

  updateCountdown();
  const countdownInterval = window.setInterval(() => {
    updateCountdown();
    if (Date.now() >= TARGET_TIME + MESSAGE_DURATION_MS) {
      window.clearInterval(countdownInterval);
    }
  }, 1000);

  // Intro is intentionally replayed on each fresh page load.
  const intro = document.getElementById("intro");
  window.setTimeout(() => {
    if (intro) intro.remove();
  }, 1400);

  document.getElementById("year").textContent = String(new Date().getFullYear());

  // Download a standard vCard contact file; no server required.
  document.getElementById("saveContact").addEventListener("click", () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:عطریات آرام",
      "ORG:Aram Perfumes",
      "TEL;TYPE=CELL,VOICE:+93799464922",
      "URL:https://www.instagram.com/aramperfumes.official",
      "URL:https://t.me/AramPerfumes",
      "ADR;TYPE=WORK:;;محله حاجی عباس، شش‌متری فاطمه‌الزهرا;هرات;;;افغانستان",
      "END:VCARD"
    ].join("\r\n");

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Aram-Perfumes.vcf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    const note = document.getElementById("saveNote");
    note.textContent = "فایل مخاطب آماده شد؛ آن را باز کنید تا به مخاطبین اضافه شود.";
  });
})();
