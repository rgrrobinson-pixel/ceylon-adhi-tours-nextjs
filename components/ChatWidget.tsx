'use client';

/**
 * ChatWidget – mounts "Adhi's Assistant" on the public site.
 *
 * The widget itself lives in /public/chatbot.js (self-contained: it injects
 * its own styles + markup). This component just sets the per-site config on
 * window.ADHI_BOT and then loads the script once, client-side.
 *
 * Config (accent colour, WhatsApp number) is passed in from the CMS so the
 * owner can change it without touching code.
 */
import { useEffect } from 'react';

declare global {
  interface Window {
    ADHI_BOT?: {
      accent?: string;
      accentInk?: string;
      whatsapp?: string;
      email?: string;
      theme?: 'light' | 'dark';
    };
  }
}

export default function ChatWidget({
  accent = '#0E6E5C',
  whatsapp = '',
  email = '',
}: {
  accent?: string;
  whatsapp?: string;
  email?: string;
}) {
  useEffect(() => {
    // Avoid double-loading on client navigation.
    if (document.getElementById('abot-launch') || document.getElementById('adhi-chatbot-script')) {
      return;
    }
    window.ADHI_BOT = {
      accent,
      accentInk: '#ffffff',
      whatsapp: (whatsapp || '').replace(/\D/g, ''),
      email,
      theme: 'light',
    };
    const s = document.createElement('script');
    s.id = 'adhi-chatbot-script';
    s.src = '/chatbot.js';
    s.async = true;
    document.body.appendChild(s);
  }, [accent, whatsapp, email]);

  return null;
}
