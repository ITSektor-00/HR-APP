import Link from "next/link";
// import { cookies } from "next/headers";

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

export default function Home() {
  // const cookieStore = cookies();
  // const token = cookieStore.get("token")?.value;
  // if (token) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60">
  //       <div className="text-2xl font-bold text-center mt-20">Dobrodošli nazad! (Ovde ide dashboard ili redirect)</div>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f8fc] py-12 px-2">
      <div className="mb-2 text-center">
        <div className="text-primary-700 font-semibold text-lg tracking-wide mb-1">Naši paketi</div>
        <h1 className="text-5xl font-extrabold mb-3 text-gray-900 drop-shadow-xl tracking-tight">Izaberi svoj plan</h1>
        <div className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">Isprobaj besplatno ili izaberi napredniji plan za svoj tim. Svi planovi uključuju podršku i redovne nadogradnje.</div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl justify-center items-stretch animate-fade-in-up">
        {plans.map((plan) => (
          <Link
            href="/registracija"
            key={plan.name}
            className={`group relative flex flex-col rounded-3xl shadow-xl border transition-all duration-300 px-8 py-10 w-full max-w-xs mx-auto cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 ${
              plan.highlight
                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white border-blue-600 scale-105 z-10"
                : "bg-white border-gray-200 text-gray-900 hover:shadow-2xl"
            } ${plan.highlight ? "hover:from-blue-700 hover:to-blue-600" : "hover:border-blue-400"}`}
            tabIndex={0}
            aria-label={`Izaberi plan: ${plan.name}`}
          >
            {plan.highlight && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white/90 text-blue-700 text-xs font-bold px-6 py-1 rounded-full shadow tracking-widest uppercase border-2 border-blue-400">Najpopularniji</span>
            )}
            <h2 className={`text-2xl font-extrabold text-center mb-2 tracking-tight ${plan.highlight ? 'text-white' : 'text-gray-900'} group-hover:underline`}>{plan.name}</h2>
            <div className={`text-center text-5xl font-extrabold mb-1 drop-shadow-lg ${plan.highlight ? 'text-white' : 'text-blue-700'}`}>{plan.price}</div>
            <div className={`text-center text-base mb-4 font-semibold ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>{plan.period}</div>
            <p className={`text-center mb-6 min-h-[48px] font-medium ${plan.highlight ? 'text-blue-100' : 'text-gray-700'}`}>{plan.description}</p>
            <ul className={`mb-10 space-y-2 ${plan.highlight ? 'text-blue-50' : 'text-gray-700'}`}>
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${plan.highlight ? 'bg-white' : 'bg-blue-500'}`}></span>
                  {f}
                </li>
              ))}
            </ul>
            <span className={`block w-full text-center py-3 rounded-full font-bold transition-all duration-200 text-lg tracking-wide shadow-lg mt-auto pointer-events-none ${plan.highlight ? "bg-white text-blue-700 group-hover:bg-blue-100" : "bg-blue-600 text-white group-hover:bg-blue-700"}`}>{plan.highlight ? "Get Started" : "Get Started"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
