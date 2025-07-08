import React from "react";

const plans = [
  {
    name: "Free verzija",
    badge: "Zauvek besplatno",
    price: "0 RSD",
    oldPrice: null,
    description: "Do 2 korisnika/sektora, osnovne funkcionalnosti, bez kartice, bez obaveza.",
    features: [
      "Do 2 korisnika/sektora",
      "Osnovne funkcionalnosti",
      "Bez kartice, bez obaveza"
    ],
    highlight: false,
    color: "bg-white",
    text: "text-black",
    border: "border-gray-200",
    badgeColor: "bg-gray-900 text-white"
  },
  {
    name: "Pro plan (3 meseca)",
    badge: "Najpopularnije",
    price: "3.900 RSD",
    oldPrice: "5.900 RSD",
    description: "Do 8 korisnika, svi moduli, premium podrška, napredne funkcije.",
    features: [
      "Do 8 korisnika",
      "Svi moduli i funkcije",
      "Premium podrška",
      "Napredni izveštaji"
    ],
    highlight: true,
    color: "bg-gradient-to-br from-[#3A3CA6] to-[#6C63FF]",
    text: "text-white",
    border: "border-none",
    badgeColor: "bg-white text-[#3A3CA6] border border-[#3A3CA6]"
  },
  {
    name: "Premium godišnji plan",
    badge: "Najbolja vrednost",
    price: "12.900 RSD",
    oldPrice: "15.900 RSD",
    description: "Do 15 korisnika, svi moduli, prioritetna podrška, ekskluzivne funkcije.",
    features: [
      "Do 15 korisnika",
      "Svi moduli i funkcije",
      "Prioritetna podrška",
      "Ekskluzivne funkcije",
      "Napredni izveštaji"
    ],
    highlight: false,
    color: "bg-white",
    text: "text-black",
    border: "border-purple-300",
    badgeColor: "bg-purple-600 text-white"
  }
];

const check = (
  <svg className="w-5 h-5 text-green-500 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function PlanoviPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-primary-50 to-primary-100 py-12">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex-1 rounded-3xl shadow-xl px-8 py-10 flex flex-col items-center transition-all duration-300 ${plan.highlight ? `${plan.color} ${plan.text} scale-105 border-2 border-blue-400` : `${plan.color} ${plan.text} ${plan.border}`} ${plan.highlight ? "z-10" : "z-0"}`}
            style={plan.highlight ? { boxShadow: "0 0 40px 0 rgba(80,80,255,0.15)" } : {}}
          >
            {plan.badge && (
              <div className={`absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold shadow-md ${plan.badgeColor}`}>{plan.badge}</div>
            )}
            <div className="text-lg font-bold mb-2 tracking-wide text-center">{plan.name}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {plan.oldPrice && <span className="text-gray-300 line-through text-xl font-semibold">{plan.oldPrice}</span>}
              <span className={`text-4xl md:text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-black"}`}>{plan.price}</span>
            </div>
            <div className={`mb-6 text-center min-h-[60px] max-w-xs mx-auto font-medium ${plan.highlight ? "text-white/90" : "text-gray-600"}`}>{plan.description}</div>
            <div className="mb-8 w-full">
              <div className="font-semibold mb-2">Šta dobijate:</div>
              <ul className="space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-base">
                    {check}
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 