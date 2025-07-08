import Link from "next/link";

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "15 dana",
    description: "Najbolje za male timove ili pojedince koji žele da isprobaju platformu. Do 2 korisnika, bez kartice.",
    features: [
      "2 korisnika",
      "Osnovne funkcionalnosti",
      "15 dana besplatno",
      "Bez kartice"
    ],
    highlight: false,
  },
  {
    name: "Pro Plan (3 meseca)",
    price: "$29",
    period: "3 meseca",
    description: "Za male i srednje firme koje žele više korisnika i naprednije opcije.",
    features: [
      "Do 8 korisnika",
      "Napredne funkcionalnosti",
      "Prioritetna podrška",
      "3 meseca korišćenja"
    ],
    highlight: true,
  },
  {
    name: "Pro Plan (Godina dana)",
    price: "$99",
    period: "12 meseci",
    description: "Za veće timove i kompanije kojima je potrebna dugoročna HR platforma.",
    features: [
      "Do 15 korisnika",
      "Sve funkcionalnosti",
      "Premium podrška",
      "12 meseci korišćenja"
    ],
    highlight: false,
  },
];

export default function PlanoviPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60 py-12 px-2">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 drop-shadow-lg">Izaberi svoj plan</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-center">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg border border-gray-200 px-8 py-10 w-full max-w-xs transition-all duration-300 ${
              plan.highlight
                ? "scale-105 z-10 border-primary-500 bg-gradient-to-b from-primary-100/90 to-white/90 shadow-3xl"
                : "hover:scale-105 hover:z-10"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">Najpopularniji</span>
            )}
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">{plan.name}</h2>
            <div className="text-center text-4xl font-extrabold text-primary-700 mb-1">{plan.price}</div>
            <div className="text-center text-base text-gray-500 mb-4">{plan.period}</div>
            <p className="text-center text-gray-700 mb-6 min-h-[48px]">{plan.description}</p>
            <ul className="mb-8 space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/registracija" className={`block w-full text-center py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${plan.highlight ? "bg-primary-700 text-white hover:bg-primary-800" : "bg-primary-100 text-primary-700 hover:bg-primary-200"}`}>Get Started</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 