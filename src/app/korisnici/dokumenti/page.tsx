"use client"

import { useState } from "react";
import PoljaForm from "./PoljaForm";
import type { PoljaPlanFormValues, PoljaUgovorVoziloFormValues } from "./PoljaForm";

const documents = [
  {
    title: "Plan korišćenja godišnjeg odmora",
    content: null // biće generisan u komponenti zbog live datuma
  },
  {
    title: "Ugovor o korišćenju putničkog vozila",
    content: ""
  },
  {
    title: "Rešenje o odsustvu sa rada bez naknade zarade (neplaćeno odsustvo)",
    content: ""
  },
  {
    title: "Rešenje o zameni rešenja o korišćenju godišnjeg odmora zbog privremene sprečenosti za rad",
    content: ""
  },
  {
    title: "Ugovor o radu",
    content: ""
  }
];

export default function KorisniciDokumenti() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showPolja, setShowPolja] = useState(false);
  const [polja, setPolja] = useState({
    clanZakona: "",
    nazivAkta: "",
    lokacija: "",
    godina: "2025",
    datumPisanja: new Date().toISOString().slice(0, 10),
    datumPotpisa: new Date().toISOString().slice(0, 10),
  });
  const [stavke, setStavke] = useState<{ zaposleni: string; nekorisceni: string; korisceni: string }[]>([]);
  const [poljaUgovorVozilo, setPoljaUgovorVozilo] = useState({
    korisnik: '',
    direktor: '',
    kompanija: 'Kompanija 1',
    adresa: '',
    maticniBroj: '',
    pib: '',
    marka: '',
    model: '',
    registracija: '',
    datumPotpisa: new Date().toISOString().slice(0, 10),
  });
  const [showPoljaUgovorVozilo, setShowPoljaUgovorVozilo] = useState(false);

  // Helperi za prikaz datuma u srpskom formatu
  function formatDatum(d: string) {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("sr-RS");
  }

  function formatDatumSR(d: string) {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('sr-RS');
  }

  function prikaziPolje(vrednost: string, placeholder: string, bold = false, italic = false) {
    if (!vrednost) vrednost = `« ${placeholder} »`;
    if (bold && italic) return <b><i>{vrednost}</i></b>;
    if (bold) return <b>{vrednost}</b>;
    if (italic) return <i>{vrednost}</i>;
    return vrednost;
  }

  function PlanGodisnjegOdmoraDynamic() {
    const datum = formatDatum(polja.datumPisanja);
    const datumPotpisa = formatDatum(polja.datumPotpisa);
    function prikaziPolje(vrednost: string, placeholder: string) {
      return vrednost ? vrednost : `« ${placeholder} »`;
    }
    return (
      <div className="flex flex-col items-center w-full">
        {/* Dugmad gore desno */}
        <div className="flex justify-end w-full max-w-5xl mb-2 gap-2">
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => setShowPolja(true)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Polja
          </button>
          <button
            className="flex items-center gap-2 bg-[#3A3CA6] hover:bg-[#23244d] text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => window.print()}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 9V4h12v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="6" y="13" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Izvoz
          </button>
        </div>
        <div className="bg-white rounded-lg shadow border border-[var(--border-color)] w-full max-w-5xl p-8 mt-2">
          <h2 className="text-2xl md:text-3xl font-bold text-left mb-12 border-b pb-2">Plan korišćenja godišnjeg odmora</h2>
          <div className="flex flex-col items-center w-full">
            <h3 className="text-2xl font-bold text-center mb-2">PLAN KORIŠĆENJA GODIŠNJEG ODMORA</h3>
            <div className="text-center mb-6">
              Na osnovu čl. 75. i 192. Zakona o radu i člana <b><i>{prikaziPolje(polja.clanZakona, "BROJ ČLANA ZAKONA")}</i></b>, <b><i>{prikaziPolje(polja.nazivAkta, "NAZIV OPŠTEG AKTA POSLODAVCA")}</i></b>, dana {datum}, donosim
            </div>
            <h4 className="text-xl font-semibold italic text-center mb-4">PLAN KORIŠĆENJA GODIŠNJEG ODMORA ZA {polja.godina || "2025"}. GODINU</h4>
            <div className="text-center mb-6 max-w-3xl">
              Zaposleni kod poslodavca, koji imaju pravo na godišnji odmor ili će to pravo steći u kalendarskoj godini, koristiće godišnji odmor za kalendarsku {polja.godina || "2025"}. godinu u vremenu utvrđenom ovim planom i to:
            </div>
            <div className="overflow-x-auto w-full mb-4">
              <table className="min-w-full border border-gray-400">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 px-4 py-2 text-left">Redni broj</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Ime i prezime zaposlenog</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Neiskorišćen godišnji odmor iz prethodne godine*</th>
                    <th className="border border-gray-400 px-4 py-2 text-left">Koristi godišnji odmor u tekućoj godini</th>
                  </tr>
                </thead>
                <tbody>
                  {stavke.length === 0 ? (
                    <tr>
                      <td className="border border-gray-400 px-4 py-2" colSpan={4}>
                        Nema unetih stavki.
                      </td>
                    </tr>
                  ) : (
                    stavke.map((s, i) => (
                      <tr key={i}>
                        <td className="border border-gray-400 px-4 py-2">{i + 1}</td>
                        <td className="border border-gray-400 px-4 py-2">{s.zaposleni}</td>
                        <td className="border border-gray-400 px-4 py-2">{s.nekorisceni}</td>
                        <td className="border border-gray-400 px-4 py-2">{s.korisceni}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-sm text-left w-full max-w-3xl mb-8 mt-2">
              * <i>navesti broj dana neiskorišćenog godišnjeg odmora iz prethodne godine, koji zaposleni ima pravo da koristi do 30. juna tekuće godine</i>
            </div>
            <div className="flex justify-between w-full max-w-3xl mt-8">
              <div>
                U <b><i>{prikaziPolje(polja.lokacija, "MESTO")}</i></b> dana {datumPotpisa}.
              </div>
              <div className="text-right">
                Za poslodavca:<br />
                <span className="inline-block border-t border-gray-400 w-40 mt-6"></span>
              </div>
            </div>
          </div>
        </div>
        <PoljaForm
          open={showPolja}
          onClose={() => setShowPolja(false)}
          values={polja}
          onChange={v => setPolja(v as PoljaPlanFormValues)}
          onAddStavka={stavka => setStavke(stare => [...stare, stavka])}
        />
      </div>
    );
  }

  function UgovorVoziloDynamic() {
    return (
      <div className="flex flex-col items-center w-full">
        {/* Dugmad gore desno */}
        <div className="flex justify-end w-full max-w-5xl mb-2 gap-2">
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => setShowPoljaUgovorVozilo(true)}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Polja
          </button>
          <button
            className="flex items-center gap-2 bg-[#3A3CA6] hover:bg-[#23244d] text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => window.print()}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6 9V4h12v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="6" y="13" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Izvoz
          </button>
        </div>
        <div className="bg-white rounded-lg shadow border border-[var(--border-color)] w-full max-w-5xl p-8 mt-2">
          <div className="flex flex-col items-center w-full">
            <h3 className="text-2xl font-bold text-center mb-2">UGOVOR O KORIŠĆENJU PUTNIČKOG VOZILA</h3>
            <div className="text-center mb-6">
              Zaključen {formatDatumSR(poljaUgovorVozilo.datumPotpisa)}. godine između:
              <br /><br />
              1. {prikaziPolje(poljaUgovorVozilo.korisnik, 'IME I PREZIME ZAPOSLENOG', true, true)} (u daljem tekstu: Zaposleni)
              <br />2. {prikaziPolje(poljaUgovorVozilo.kompanija, 'KOMPANIJA', true)} , adresa: {prikaziPolje(poljaUgovorVozilo.adresa, 'ADRESA', true)}, matični broj: {prikaziPolje(poljaUgovorVozilo.maticniBroj, 'MATIČNI BROJ', true)}, PIB: {prikaziPolje(poljaUgovorVozilo.pib, 'PIB', true)}, koga zastupa direktor {prikaziPolje(poljaUgovorVozilo.direktor, 'IME I PREZIME DIREKTORA', true, true)} (u daljem tekstu: Poslodavac) sa jedne strane i
            </div>
            <div className="text-center font-bold mb-2">Član 1.</div>
            <div className="mb-4 max-w-3xl text-center">
              Ugovorne strane su saglasne da je prema odredbama Car Policy kod Poslodavca propisano da Zaposleni ima pravo na korišćenje službenog automobila, za koje bi Poslodavac snosio troškove goriva, održavanja, kako redovnog tako i vanrednog, trošak registracije i osiguranja i kasko osiguranja.<br /><br />
              Zaposleni će za dolazak i odlazak sa rada, kao i u druge svrhe, po principu 24/7 (24 sata, 7 dana u nedelji) koristiti vozilo marke {prikaziPolje(poljaUgovorVozilo.marka, 'MARKA', true)}, model {prikaziPolje(poljaUgovorVozilo.model, 'MODEL', true)}, registarske oznake {prikaziPolje(poljaUgovorVozilo.registracija, 'REGISTARSKA OZNAKA', true)}.
            </div>
            <div className="text-center font-bold mb-2">Član 2.</div>
            <div className="mb-4 max-w-3xl text-center">
              Poslodavac dodeljuje vozilo iz prethodnog člana Zaposlenom na besplatno korišćenje za sve vreme dok je Zaposleni radno angažovan kod Poslodavca.<br />
              Zaposlenom se dodeljuje kartica za gorivo bez limita.<br /><br />
              Poslodavac Zaposlenom dodeljuje vozilo na besplatno korišćenje za teritoriju Srbije i inostranstva. Poslodavac će Zaposlenom izdati pisano ovlašćenje za upravljanje vozilom.
            </div>
            <div className="text-center font-bold mb-2">Član 3.</div>
            <div className="mb-4 max-w-3xl text-center">
              Ugovorne strane mogu raskinuti ovaj ugovor sporazumno, pisanim putem, sa otkaznim rokom od 30 dana.<br />
              U slučaju prestanka radnog odnosa Zaposlenog, ovaj ugovor prestaje da važi.
            </div>
            <div className="text-center font-bold mb-2">Član 4.</div>
            <div className="mb-4 max-w-3xl text-center">
              Za sve što nije regulisano ovim ugovorom primenjivaće se odredbe Zakona o obligacionim odnosima.<br />
              U slučaju spora proisteklog iz ovog ugovora nadležan je sud u Beogradu.
            </div>
            <div className="text-center font-bold mb-2">Član 5.</div>
            <div className="mb-8 max-w-3xl text-center">
              Ovaj ugovor je sačinjen u 2 (dva) istovetna primerka, pri čemu svaka ugovorna strana zadržava po 1 (jedan) primerak.
            </div>
            <div className="flex justify-between w-full max-w-3xl mt-8">
              <div>
                Zaposleni:<br />
                <span className="inline-block border-t border-gray-400 w-60 mt-6"></span>
              </div>
              <div className="text-right">
                Za poslodavca:<br />
                <span className="inline-block border-t border-gray-400 w-60 mt-6"></span><br />
                Direktor {prikaziPolje(poljaUgovorVozilo.direktor, 'IME I PREZIME DIREKTORA', true, true)}
              </div>
            </div>
          </div>
        </div>
        <PoljaForm
          open={showPoljaUgovorVozilo}
          onClose={() => setShowPoljaUgovorVozilo(false)}
          values={poljaUgovorVozilo}
          onChange={v => setPoljaUgovorVozilo(v as PoljaUgovorVoziloFormValues)}
          docType="ugovor-vozilo"
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--main-bg)] min-h-screen">
      {/* Naslov sa ikonicom */}
      <div className="flex items-center gap-4 mb-2">
        <div className="bg-[#3A3CA6] p-3 rounded-lg">
          {/* SVG ikonica */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="3" fill="#fff"/>
            <rect x="3" y="4" width="18" height="16" rx="3" stroke="#3A3CA6" strokeWidth="2"/>
            <rect x="7" y="8" width="10" height="2" rx="1" fill="#3A3CA6"/>
            <rect x="7" y="12" width="7" height="2" rx="1" fill="#3A3CA6"/>
          </svg>
        </div>
        <div>
          <div className="text-lg text-[var(--text-secondary)] leading-tight">Kancelarija</div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] leading-tight">Dokumenti</h1>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-[#E5E8EF] text-[var(--text-secondary)] rounded-lg px-4 py-3 mb-6">
        Ovde možete pronaći pravni dokument koji vam je potreban, kao i formular za jednostavno popunjavanje istog.
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-4">
        {documents.map((doc, idx) => (
          <div key={doc.title} className="bg-white rounded-lg shadow border border-[var(--border-color)]">
            <button
              className="w-full flex justify-between items-center px-6 py-5 text-left text-xl font-semibold text-[var(--text-primary)] focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              aria-expanded={openIndex === idx}
            >
              {doc.title}
              <span className="ml-4">
                <svg
                  className={`transition-transform duration-200 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9l6 6 6-6" stroke="#3A3CA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-0 pb-8 animate-fade-in">
                {idx === 0 ? <PlanGodisnjegOdmoraDynamic /> : idx === 1 ? <UgovorVoziloDynamic /> : <div className="p-6 text-[var(--text-secondary)] text-base">Nema podataka za ovaj dokument.</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease;
        }
      `}</style>
    </div>
  );
} 