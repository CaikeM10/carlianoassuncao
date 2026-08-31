import { MessageCircle, X } from "lucide-react";
import React, { useState } from "react";

const WHATSAPP_URL =
  "https://wa.me/558899815110?text=Olá!%20Gostaria%20de%20agendar%20um%20atendimento.";

export function WhatsappFloat() {
  const [closed, setClosed] = useState(false);

  return (
    <>
      {!closed && (
        <div
          className="
            fixed
            bottom-25
            right-7
            z-[9999]
            hidden
            md:block
            animate-in
            fade-in
            slide-in-from-bottom-4
            duration-400
          "
        >
          <div
            className="
              relative
              max-w-[280px]
              rounded-3xl
              bg-[#F7F5F0]
              p-3
              border
              border-[#1E2824]/5
              shadow-[0_20px_60px_rgba(0,0,0,0.12)]
            "
          >
            <button
              onClick={() => setClosed(true)}
              className="
                absolute
                right-4
                top-4
                text-[#1E2824]/35
                hover:text-[#1E2824]/60
                transition-colors
              "
            >
              <X size={16} />
            </button>

            <p
              className="text-[#1E2824] mb-2"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.5rem",
              }}
            >
              Olá 👋
            </p>

            <p className="text-[#1E2824]/65 text-sm leading-relaxed mb-4">
              Seu atendimento começa aqui.
              <br />
              Posso ajudar?
            </p>
          </div>
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="
          fixed
          bottom-6
          right-6
          z-[9999]
          hidden
          md:flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#25D366]
          text-white
          shadow-[0_12px_40px_rgba(37,211,102,0.4)]
          hover:scale-105
          transition-all
        "
      >
        <MessageCircle size={30} />
      </a>
    </>
  );
}
