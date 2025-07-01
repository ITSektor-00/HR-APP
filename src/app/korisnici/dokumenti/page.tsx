"use client"

import { useState } from "react";
import PoljaForm from "./PoljaForm";
import type { PoljaPlanFormValues, PoljaUgovorVoziloFormValues, PoljaResenjeOdsustvoFormValues, PoljaResenjeZamenaGodisnjiFormValues, PoljaUgovorORaduFormValues } from "./PoljaForm";

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
  const [poljaResenjeOdsustvo, setPoljaResenjeOdsustvo] = useState({
    zaposleni: '',
    direktor: '',
    kompanija: 'Kompanija 1',
    adresa: '',
    maticniBroj: '',
    pib: '',
    clanZakona: '',
    nazivAkta: '',
    lokacija: '',
    datumPisanja: new Date().toISOString().slice(0, 10),
    datumPotpisa: new Date().toISOString().slice(0, 10),
    razlogOdsustva: '',
    periodOdsustva: '',
    broj: '',
    nazivPoslova: '',
    odredjenoNeodredjeno: '',
    brojUgovora: '',
    ovlascenoLice: '',
    dostavljeno2: '',
    dostavljeno3: '',
  });
  const [showPoljaResenjeOdsustvo, setShowPoljaResenjeOdsustvo] = useState(false);
  const [poljaResenjeZamenaGodisnji, setPoljaResenjeZamenaGodisnji] = useState<PoljaResenjeZamenaGodisnjiFormValues>({
    kompanija: 'Kompanija 1',
    adresa: '',
    broj: '',
    mesto: '',
    datum: new Date().toISOString().slice(0, 10),
    zakon: '',
    clanZakona: '',
    clanUgovora: '',
    brojOvlascenja: '',
    direktor: '',
    zaposleni: '',
    nazivPosla: '',
    brojResenja: '',
    brojRada: '',
    mestoDomaZdravlja: '',
    dostavljeno2: '',
    dostavljeno3: '',
    datumPocetka: new Date().toISOString().slice(0, 10),
    datumZavrsetka: new Date().toISOString().slice(0, 10),
    trajanjeUDanima: '0',
  });
  const [showPoljaResenjeZamenaGodisnji, setShowPoljaResenjeZamenaGodisnji] = useState(false);
  const [poljaUgovorORadu, setPoljaUgovorORadu] = useState<PoljaUgovorORaduFormValues>({
    kompanija: 'Kompanija 1',
    maticniBroj: '',
    pib: '',
    adresa: '',
    datumPotpisa: new Date().toISOString().slice(0, 10),
    direktor: '',
    zaposleni: '',
    posao: '',
    stepenStrucneSpreme: '',
    mestoRodjenja: '',
    zanimanje: '',
    odredjenoNeodredjeno: '',
    datumPocetka: new Date().toISOString().slice(0, 10),
    datumZavrsetka: new Date().toISOString().slice(0, 10),
    nadoknadaZaIshranu: '',
    regresZaGodisnji: '',
    odgovornost: '',
    plata: '',
  });
  const [showPoljaUgovorORadu, setShowPoljaUgovorORadu] = useState(false);

  // Helper za današnji datum u formatu yyyy-mm-dd
  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

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

  function ResenjeOdsustvoDynamic() {
    // Uvek koristi live datum za prikaz
    const datum = formatDatum(todayISO());
    const datumPotpisa = formatDatum(todayISO());
    return (
      <div className="flex flex-col items-center w-full">
        {/* Dugmad gore desno */}
        <div className="flex justify-end w-full max-w-5xl mb-2 gap-2">
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => setShowPoljaResenjeOdsustvo(true)}
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
        <div className="bg-white rounded-lg shadow border border-[var(--border-color)] w-full max-w-4xl p-12 mt-2">
          <h2 className="text-2xl font-bold text-center mb-8">REŠENJE O ODSUSTVU SA RADA BEZ NAKNADE ZARADE (NEPLAĆENO ODSUSTVO)</h2>
          <div className="text-left font-semibold mb-4">
            Kompanija 1, <i>{prikaziPolje(poljaResenjeOdsustvo.adresa, "ADRESA", true)}</i><br />
            <b>** {prikaziPolje(poljaResenjeOdsustvo.broj, "BROJ", true)} **</b><br />
            <b>** {prikaziPolje(poljaResenjeOdsustvo.lokacija, "MESTO", true)} </b>, {datum}
          </div>
          <div className="mb-6">
            Na osnovu čl. 78. i 192. Zakona o radu ("Sl. glasnik RS", <b><i>{prikaziPolje(poljaResenjeOdsustvo.clanZakona, "ZAKON")}</i></b> - dalje: Zakon) <b><i>NADLEŽNI ORGAN</i></b> (navesti nadležni organ kod poslodavca, odnosno lice utvrđeno zakonom ili osnivačkim ili drugim opštim aktom poslodavca ili lice koje su oni ovlastili – dalje: ovlašćeno lice) Kompanija 1, <b><i>{prikaziPolje(poljaResenjeOdsustvo.adresa, "ADRESA")}</i></b> (navesti naziv i sedište poslodavca) donosi:
          </div>
          <h3 className="text-xl font-bold text-center mb-4">REŠENJE</h3>
          <div className="mb-6">
            1. Zaposlenom <b><i>{prikaziPolje(poljaResenjeOdsustvo.zaposleni, "IME I PREZIME ZAPOSLENOG")}</i></b> (ime i prezime, stepen stručne spreme i zanimanje), na poslovima Kompanija 1, <b><i>{prikaziPolje(poljaResenjeOdsustvo.adresa, "ADRESA")}</i></b> (naziv poslova na kojima imenovano lice radi), a na njegov lični zahtev – odobrava se odsustvo sa rada bez naknade zarade (neplaćeno odsustvo) u trajanju od <b><i>{prikaziPolje(poljaResenjeOdsustvo.periodOdsustva, "VREMENSKI PERIOD")}</i></b> (navesti vremenski period, npr. petnaest dana, tri meseca, jedne godine i slično), počev od {datumPotpisa} do {datumPotpisa}.
          </div>
          <div className="mb-6">
            2. Zaposleni iz stava 1. dispozitiva ovog rešenja dužan je da se vrati na rad {datumPotpisa} godine.
          </div>
          <div className="mb-6">
            3. Za vreme trajanja odsustva sa rada bez naknade zarade, zaposlenom miruju prava i obaveze iz radnog odnosa. (NAPOMENA: Rešenjem se mogu utvrditi određena prava i obaveze zaposlenog za koje je Zakonom, opštim aktom ili ugovorom o radu drukčije određeno i ta prava je potrebno uneti u dispozitiv rešenja).
          </div>
          <h4 className="text-xl font-bold text-center mb-4">Obrazloženje</h4>
          <div className="mb-6">
            Zaposleni <b><i>{prikaziPolje(poljaResenjeOdsustvo.zaposleni, "IME I PREZIME ZAPOSLENOG")}</i></b> (ime i prezime) se nalazi u radnom odnosu kod poslodavca Kompanija 1, <b><i>{prikaziPolje(poljaResenjeOdsustvo.adresa, "ADRESA")}</i></b> na <b><i>{prikaziPolje(poljaResenjeOdsustvo.odredjenoNeodredjeno, "ODREĐENO ILI NEODREĐENO")}</i></b> vreme, na poslovima <b><i>{prikaziPolje(poljaResenjeOdsustvo.nazivPoslova, "NAZIV POSLOVA")}</i></b>, a na osnovu ugovora o radu broj <b><i>{prikaziPolje(poljaResenjeOdsustvo.brojUgovora, "BROJ UGOVORA O RADU")}</i></b> od {datumPotpisa} godine.
          </div>
          <div className="mb-6">
            Dana {datumPotpisa} godine, zaposleni je poslodavcu podneo zahtev za odsustvo sa rada bez naknade zarade (neplaćeno odsustvo) u kome je naveo razloge zbog kojih traži korišćenje odsustva. (Uz svoj zahtev, zaposleni može da priloži i odgovarajuću dokumentaciju kojom dokazuje razloge i osnov povodom kojih traži korišćenje neplaćenog odsustva, ali to ne predstavlja bitan uslov, već ima svrhu da poslodavac stekne objektivnu predstavu prema podnetom zahtevu).
          </div>
          <div className="mb-6">
            Članom 78. Zakona predviđeno je da poslodavac može zaposlenom da odobri odsustvo bez naknade zarade (neplaćeno odsustvo). Za vreme neplaćenog odsustva zaposlenom miruju prava i obaveze iz radnog odnosa, ako za pojedina prava i obaveze zakonom, opštim aktom ugovorom o radu nije drukčije određeno. S obzirom da je ovlašćeno lice poslodavca konstatovalo da zaposleni iz stava 1. dispozitiva ovog rešenja ispunjava uslove predviđene članom 78. Zakona, te ne postoje nikakve smetnje da zaposlenom bude odobreno njegovo korišćenje, odlučeno je kao u dispozitivu.
          </div>
          <div className="mb-6 font-semibold">POUKA O PRAVNOM LEKU:</div>
          <div className="mb-6">
            Protiv ovog rešenja zaposleni može da pokrene radni spor pred nadležnim sudom u roku od 60 dana od dana njegovog dostavljanja.
          </div>
          <div className="mb-6">
            <b><i>{prikaziPolje(poljaResenjeOdsustvo.lokacija, "MESTO", true)}</i></b>, dana {datumPotpisa} godine
          </div>
          <div className="flex justify-between w-full max-w-3xl mb-8">
            <div></div>
            <div className="text-right">
              Ovlašćeno lice:<br />
              <span className="inline-block border-t border-gray-400 w-60 mt-6 mb-2"></span><br />
              <b><i>{prikaziPolje(poljaResenjeOdsustvo.ovlascenoLice, "OVLAŠĆENO LICE", true)}</i></b>
            </div>
          </div>
          <div className="mb-2 font-semibold">Dostavljeno:</div>
          <div className="mb-2">1. Zaposlenom</div>
          <div className="mb-2">2. <b><i>{prikaziPolje(poljaResenjeOdsustvo.dostavljeno2, "DOSTAVLJENO 2", true)}</i></b></div>
          <div className="mb-2">3. <b><i>{prikaziPolje(poljaResenjeOdsustvo.dostavljeno3, "DOSTAVLJENO 3", true)}</i></b></div>
        </div>
        <PoljaForm
          open={showPoljaResenjeOdsustvo}
          onClose={() => setShowPoljaResenjeOdsustvo(false)}
          values={poljaResenjeOdsustvo}
          onChange={v => setPoljaResenjeOdsustvo(v as PoljaResenjeOdsustvoFormValues)}
          docType="resenje-odsustvo"
        />
      </div>
    );
  }

  function ResenjeZamenaGodisnjiDynamic() {
    const datum = formatDatum(poljaResenjeZamenaGodisnji.datum);
    const datumPocetka = formatDatum(poljaResenjeZamenaGodisnji.datumPocetka);
    const datumZavrsetka = formatDatum(poljaResenjeZamenaGodisnji.datumZavrsetka);
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-end w-full max-w-5xl mb-2 gap-2">
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => setShowPoljaResenjeZamenaGodisnji(true)}
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
        <div className="bg-white rounded-lg shadow border border-[var(--border-color)] w-full max-w-4xl p-12 mt-2">
          <h2 className="text-2xl font-bold text-center mb-8">REŠENJE O ZAMENI REŠENJA O KORIŠĆENJU GODIŠNJEG ODMORA ZBOG PRIVREMENE SPREČENOSTI ZA RAD</h2>
          <div className="text-left font-semibold mb-4">
            Kompanija 1, <i>{prikaziPolje(poljaResenjeZamenaGodisnji.adresa, "ADRESA", true)}</i><br />
            <b>** {prikaziPolje(poljaResenjeZamenaGodisnji.broj, "BROJ", true)} **</b><br />
            <b>** {prikaziPolje(poljaResenjeZamenaGodisnji.mesto, "MESTO", true)} </b>, {datum}
          </div>
          <div className="mb-6">
            Na osnovu člana 69, člana 70. stav 3. i člana 192. Zakona o radu ("Sl. glasnik RS", br. <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.zakon, "ZAKON")}</i></b> - dalje: Zakon), člana <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.clanZakona, "ČLAN ZAKONA")}</i></b> Kolektivnog ugovora kod poslodavca/Pravilnika o radu i člana <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.clanUgovora, "ČLAN UGOVORA")}</i></b> ugovora o radu, direktor/preduzetnik (ili drugi organ utvrđen zakonom ili opštim aktom poslodavca, ili drugo lice na osnovu ovlašćenja broj <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.brojOvlascenja, "BROJ OVLAŠĆENJA")}</i></b> od <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.direktor, "DIREKTOR / PREDUZETNIK")}</i></b>, direktora ili drugog organa utvrđenog zakonom ili opštim aktom poslodavca) donosi:
          </div>
          <h3 className="text-xl font-bold text-center mb-4">REŠENJE O ZAMENI REŠENJA O KORIŠĆENJU GODIŠNJEG ODMORA ZBOG PRIVREMENE SPREČENOSTI ZA RAD ZAPOSLENOG</h3>
          <div className="mb-6">
            1. Zaposlenom <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.zaposleni, "IME I PREZIME ZAPOSLENOG")}</i></b>, na poslovima <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.nazivPosla, "NAZIV POSLOVA")}</i></b>, odobrava se korišćenje neiskorišćenog dela godišnjeg odmora za 2025 godinu u ukupnom trajanju od {poljaResenjeZamenaGodisnji.trajanjeUDanima || 0} radnih dana u periodu od {datumPocetka} do {datumZavrsetka} godine.
          </div>
          <div className="mb-6">
            2. Ovim rešenjem zamenjuje se rešenje poslodavca broj <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.brojResenja, "BROJ REŠENJA")}</i></b> od {datum} godine.
          </div>
          <div className="mb-6">
            3. Za vreme odsustvovanja sa rada zbog korišćenja godišnjeg odmora zaposleni ima pravo na naknadu zarade u visini prosečne zarade u prethodnih 12 meseci, u skladu sa opštim aktom i ugovorom o radu.
          </div>
          <h4 className="text-xl font-bold text-center mb-4">Obrazloženje</h4>
          <div className="mb-6">
            Rešenjem direktora/preduzetnika (ili drugog organa utvrđenog zakonom ili opštim aktom poslodavca) broj <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.brojResenja, "BROJ REŠENJA")}</i></b> od {datum} godine - zaposlenom <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.zaposleni, "IME I PREZIME ZAPOSLENOG")}</i></b>, na poslovima <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.nazivPosla, "NAZIV POSLOVA")}</i></b> odobreno je korišćenje godišnjeg odmora za 2025. godinu u ukupnom trajanju od {poljaResenjeZamenaGodisnji.trajanjeUDanima || 0} radnih dana u periodu od {datumPocetka} do {datumZavrsetka} godine.
          </div>
          <div className="mb-6">
            U toku korišćenja godišnjeg odmora, kod imenovanog je nastupila privremena sprečenost za rad u smislu propisa o zdravstvenom osiguranju, o čemu je kao dokaz priložio Potvrdu nadležnog lekara o privremenoj sprečenosti za rad broj <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.brojRada, "BROJ RADA")}</i></b> od 2025. godine, izdate u <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.mestoDomaZdravlja, "MESTO DOMA ZDRAVLJA")}</i></b> od strane izabrane ustanove medicine rada Doma zdravlja za broj <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.brojRada, "BROJ RADA")}</i></b> od 2025. godine.
          </div>
          <div className="mb-6">
            Svojim zahtevom za izmenu rešenja o korišćenju godišnjeg odmora zbog privremene sprečenosti za rad koji je podneo poslodavcu dana {datum} godine, zaposleni je tražio da mu bude omogućeno da iskoristi neiskorišćeni deo godišnjeg odmora za 2025. godinu u ukupnom trajanju od {poljaResenjeZamenaGodisnji.trajanjeUDanima || 0} radnih dana i to u periodu od {datumPocetka} do {datumZavrsetka} godine.
          </div>
          <div className="mb-6">
            Članom 70. stav 3. Zakona predviđeno je da ako je zaposleni za vreme korišćenja godišnjeg odmora privremeno sprečen za rad u smislu propisa o zdravstvenom osiguranju – ima pravo da po isteku te sprečenosti za rad nastavi sa korišćenjem godišnjeg odmora.
          </div>
          <div className="mb-6">
            S obzirom da je u skladu sa navedenim propisom zaposleni stekao pravo da po isteku privremene sprečenosti za rad nastavi sa korišćenjem godišnjeg odmora, a da je članom 68. stav. 4. Zakona utvrđeno da zaposleni ne može da se odrekne prava na godišnji odmor, niti mu se to pravo može uskratiti ili zameniti novčanom naknadom, odlučeno je kao u dispozitivu.
          </div>
          <div className="mb-6 font-semibold">POUKA O PRAVNOM LEKU:</div>
          <div className="mb-6">
            Protiv ovog rešenja zaposleni ima pravo da pokrene spor pred nadležnim sudom, u roku od 60 dana od dana dostavljanja.
          </div>
          <div className="flex justify-between w-full max-w-3xl mb-8">
            <div>
              <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.mesto, "MESTO", true)}</i></b>, dana {datum} godine
            </div>
            <div className="text-right">
              Direktor / preduzetnik:<br />
              <span className="inline-block border-t border-gray-400 w-60 mt-6 mb-2"></span><br />
              <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.direktor, "DIREKTOR / PREDUZETNIK", true)}</i></b>
            </div>
          </div>
          <div className="mb-2 font-semibold">Dostavljeno:</div>
          <div className="mb-2">1. Zaposlenom</div>
          <div className="mb-2">2. <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.dostavljeno2, "DOSTAVLJENO 2", true)}</i></b></div>
          <div className="mb-2">3. <b><i>{prikaziPolje(poljaResenjeZamenaGodisnji.dostavljeno3, "DOSTAVLJENO 3", true)}</i></b></div>
        </div>
        <PoljaForm
          open={showPoljaResenjeZamenaGodisnji}
          onClose={() => setShowPoljaResenjeZamenaGodisnji(false)}
          values={poljaResenjeZamenaGodisnji}
          onChange={v => setPoljaResenjeZamenaGodisnji(v as PoljaResenjeZamenaGodisnjiFormValues)}
          docType="resenje-zamena-godisnji"
        />
      </div>
    );
  }

  function UgovorORaduDynamic() {
    const datumPotpisa = formatDatumSR(poljaUgovorORadu.datumPotpisa);
    const datumPocetka = formatDatumSR(poljaUgovorORadu.datumPocetka);
    const datumZavrsetka = formatDatumSR(poljaUgovorORadu.datumZavrsetka);
    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-end w-full max-w-5xl mb-2 gap-2">
          <button
            className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
            onClick={() => setShowPoljaUgovorORadu(true)}
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
          <h2 className="text-3xl font-bold mb-8 text-left">Ugovor o radu</h2>
          <div className="text-center mb-6">
            Na osnovu članova 30. - 33. Zakona o radu Republike Srbije (»Službeni glasnik br. RS« 24/2005, 61/2005, 54/2009, 32/2013, 75/2014 i 13/2017-odluke US, 113/2017 i 95/2018 - autentično tumačenje«), (u daljem tekstu: Zakon), i na osnovu Pravilnika o radu kod poslodavca {prikaziPolje(poljaUgovorORadu.kompanija, "KOMPANIJA")}, ugovorne strane:
            <br /><br />
            1. {prikaziPolje(poljaUgovorORadu.kompanija, "KOMPANIJA")}, <b>« {prikaziPolje(poljaUgovorORadu.adresa, "ADRESA")} »</b>, matični broj : <b>« {prikaziPolje(poljaUgovorORadu.maticniBroj, "MATIČNI BROJ")} »</b>, PIB: <b>« {prikaziPolje(poljaUgovorORadu.pib, "PIB")} »</b>, koga zastupa direktor <b>« {prikaziPolje(poljaUgovorORadu.direktor, "IME I PREZIME DIREKTORA")} »</b> (u daljem tekstu: Poslodavac) sa jedne strane i<br />
            <b>« {prikaziPolje(poljaUgovorORadu.zaposleni, "IME I PREZIME ZAPOSLENOG")} »</b> iz <b>« {prikaziPolje(poljaUgovorORadu.mestoRodjenja, "MESTO ROĐENJA ZAPOSLENOG")} »</b>, <b>« {prikaziPolje(poljaUgovorORadu.stepenStrucneSpreme, "STEPEN STRUČNE SPREME")} »</b> stepen stručne spreme, po zanimanju <b>« {prikaziPolje(poljaUgovorORadu.zanimanje, "ZANIMANJE")} »</b> (u daljem tekstu: Zaposleni), sa druge strane dana {datumPotpisa} godine zaključuju:
          </div>
          <h2 className="text-3xl font-bold text-center mb-8">UGOVOR O RADU</h2>
          <div className="text-center font-bold mb-2">Član 1.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">
            Zaposleni je zasnovao radni odnos na <b>« {prikaziPolje(poljaUgovorORadu.odredjenoNeodredjeno, "ODREĐENO ILI NEODREĐENO")} »</b> vreme, sa probnim radom u trajanju od tri meseca i sa punim radnim vremenom u trajanju od 40 časova nedeljno, na poslovima <b>Export- import account</b> koje će obavljati u sedištu Poslodavca u Beogradu, počev od {datumPocetka}, kada je dužan da stupi na rad, a najkasnije do {datumZavrsetka}.
          </div>
          <div className="text-center font-bold mb-2 mt-8">Član 2.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">
            Zaposleni će na poslovima <b>« {prikaziPolje(poljaUgovorORadu.posao, "POSAO")} »</b> obavljati poslove za koje se zahteva 6.2 stepen stručne spreme i odgovoran je za:
            <ul className="list-disc text-left ml-8 mt-2">
              <li>Materijalne i finansijske rezultate za poverenu robnu grupu, kategoriju po pitanju nabavke, zaliha, RUC-a</li>
              <li>Predlog kompletnog asortimana za poverenu robnu grupu, u skladu sa strategijom i planovima kompanije,odluke o ulistavanju artikala</li>
              <li>Učešće u godišnjim i periodičnim planovima nabavke za poverenu robnu grupu, planove budžeta, marži i vanrednih prihoda, te praćenje izvršenja planova</li>
              <li>Kontaktiranje potencijalnih domaćih i ino-dobavljača, pripremu i pregovore oko komercijalnih uslova, koje treba ugovoriti, te predloge zaključivanja Ugovora sa dobavljačima (ili izmena postojećih Ugovora)</li>
              <li>Praćenje ispunjavanja prava i obaveza iz komercijalnih ugovora i komercijalnih aranžmana, izveštavanje u vezi sa njima i rešavanje eventualnih neusaglašenosti</li>
              <li>Kontaktiranje potencijalnih domaćih i ino-dobavljača, saglasno politici kompanije, a u vezi sa dogovoranjem i organizovanjem operativnih poslova (ulistavanja, izlistavanja, akcija, prikupljanja različitih vrsta saglasnosti, poručivanja robe, isporuke, plaćanja...)</li>
              <li>Praćenje zaliha i asortimana robe u objektima MPO, kao i kupca kompanije i objektima veleprodaje</li>
              <li>Praćenje prodajnih i finansijskih rezultata, kroz odgovarajuće periodične izveštaje, te predlaganje aktivnosti ukoliko ima potrebe za korekcijom istih (unutar sektora CM-a ili unutar čitave kompanije)</li>
              <li>Utvrđivanje optimalnog stanja zaliha poverene robne grupe, u skladu sa planovima kompanije i vođenje računa o adekvatnom stanju zaliha (prema planovima kompanije)</li>
              <li>Analizu starosnih zaliha i pokretanje akcija za smanjenje starosti zaliha</li>
              <li>Analizu cenovnika, na osnovu preporučenih cena, tržišne situacije i planova kompanije, te nadgledanje procesa izmena cenovnika</li>
              <li>Definisanje i promene prodajnih cena u skladu sa usvojenom cenovnom strategijom</li>
              <li>Odluku o definisanju akcijskih proizvoda</li>
              <li>Praćenje trendova na tržištu, analizu tržišta, ponašanja potrošača, kao i aktivnosti konkurencije, te prepoznavanje područja u kojima postoji potencijal i prilika za rast i u skladu sa tim preduzima potrebne mere za razvoj poverene kategorije</li>
              <li>Upravljanje asortimanom poverene robne grupe u različitim kanalima prodaje unutar kompanije</li>
              <li>Stanje lagera i magacina</li>
              <li>Učestvovanje u popisima</li>
              <li>Definisanje lay-outa za različite kategorije MPO, kao i sve izmene u vezi sa istim.</li>
              <li>Obilaske MPO, kako bi se uverio o pozicioniranosti poverenih kategorija za koje je zadužen, razmenu informacija sa zaposlenima u maloprodaji radi dobijanja realne i aktuelne slike "sa terena"</li>
              <li>Osmišljavanje, izradu i distribuciju izveštaja u vezi sa svojim radom, radom svoje organizacione jedinice, kao i svim aspektima poslova koje obavlja, a u skladu sa dinamikom i temama dogovorenim sa nadređenim</li>
              <li>Praćenje inovacija, trendova, tržišnih dešavanja u svom domenu posla, te analizu istih i razmatranje implementacije istih u poslovanje kompanije</li>
              <li>Stalnu otvorenost za sticanje novih i nadogradnju postojećih znanja i veština, kao i spremnost i angažovanje da sopstvena znanja prenese kolegama i novozaposlenima</li>
              <li>Pridržavanje internih pravila u radu, kroz poznavanje i poštovanje odredbi različitih procedura, pravilnika, odluka itd, relevantnih za oblast rada zaposlenog, kao i davanje predloga za poboljšanje i unapređenje svih internih pravila rada i poslovanja</li>
              <li>Obezbeđivanje uslova za primenu i pridržavanje mera BZNR, ZOP</li>
              <li>Obavljanje i ostalih poslova po nalogu nadređenog</li>
            </ul>
            <br />Za izvršenje poslova Zaposleni je neposredno odgovoran <b>« {prikaziPolje(poljaUgovorORadu.odgovornost, "ODGOVORNOST")} »</b>.
          </div>
          <div className="text-center font-bold mb-2 mt-8">Član 3.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni se obavezuje da poštuje raspored rada kod Poslodavca u pogledu dnevnog i nedeljnog radnog vremena.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 4.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zarada Zaposlenog za obavljeni rad i vreme provedeno na radu, sastoji se od osnovne zarade, uvećane zarade i dela zarade za radni učinak. Osnovna mesečna Zarada Zaposlenog za obavljeni rad i puno radno vreme provedeno na radu, uz standardni radni učinak, iznosi BRUTO I <b>« {prikaziPolje(poljaUgovorORadu.plata, "ZARADA")} »</b> dinara.<br /><br />Poslodavac je dužan da jednom mesečno, u skladu sa Ugovorom, isplati zbir iznosa iz stava 2 i stava 3 ovog člana.<br /><br />Zarada Zaposlenog je tajna. Odavanje podataka o iznosu isplaćene zarade predstavlja povreduposlovne tajne.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 5.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni, ima pravo na uvećanu zaradu saglasno Zakonu i Pravilniku o radu i to:<br />1) Za rad na dan praznika koji je neradni dan - 110% od osnovice;<br />2) Za rad noću, ako takav rad nije vrednovan pri utvrđivanju osnovne zarade - 26% od osnovice;<br />3) Za prekovremeni rad - 26% od osnovice;<br />4) po osnovu vremena provedenog na radu za svaku punu godinu rada ostvarenu u radnom odnosu kod Poslodavca, ili sa njim povezanog lica, kao i u slučaju rada kod poslodavca prethodnika čiji je sledbenik Poslodavac na osnovu statusne promene ili promene nakon koje je Poslodavac postao pravni sledbenik poslodavca preuzimajući istovremeno i sve ugovore o radu koji su važeći na dan promene u skladu sa članom 147 Zakona - 0,4% od osnovice. Osnovicu za obračun uvećane zarade čini poslednja ugovorena osnovna bruto zarada, utvrđena u skladu sa Zakonom, opštim aktom i Ugovorom o radu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 6.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zarada, naknade zarada i troškova isplaćuju se jednom mesečno i to do kraja tekućeg meseca za prethodni mesec. Poslodavac i Zaposleni visinu osnovne zarade mogu menjati zaključenjem aneksa Ugovora o radu, a u skladu sa Zakonom i opštim aktima Poslodavca.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 7.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni ima pravo na naknadu zarade u visini prosečne zarade za prethodnih 12 meseci za vreme odsustvovanja sa rada na dan praznika koji je neradni dan, godišnjeg odmora, plaćenog odsustva, vojne vežbe i odazivanja na poziv državnog organa.<br /><br />Zaposleni ima pravo na naknadu zarade za vreme odsustvovanja sa rada zbog privremene sprečenosti za rad do 30 dana i to:<br /><br />U visini 65% prosečne zarade za prethodnih 12 meseci pre meseca u kojem je nastupila privremena sprečenost za rad prouzrokovana bolešću ili povredom van rada;<br />U visini 100% prosečne zarade za prethodnih 12 meseci pre meseca u kojem je nastupila privremena sprečenost za rad prouzrokovana povredom na radu ili profesionalnom bolešću;<br />Zaposleni ima pravo na naknadu zarade u visini 60% prosečne zarade za prethodnih 12 meseci za vreme prekida rada do kojeg je došlo bez krivice Zaposlenog, najduže 45 radnih dana u kalendarskoj godini.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 8.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni je obavezan da, najkasnije u roku od 3 dana nakon nastupanja privremene sprečenosti za rad, a shodno propisima o zdravstvenom osiguranju, dostavi, u skladu sa Pravilnikom o radu,<br /><br />Poslodavcu potvrdu lekara koja sadrži i vreme očekivane sprečenosti za rad.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 9.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni ima pravo na naknadu troškova:<br /><br />Za dolazak i odlazak sa rada u visini cene prevozne karte u javnom saobraćaju, ukoliko Poslodavac nije na drugi način obezbedio troškvoe prevoza Zaposlenog;<br />vreme provedeno na službenom putu u skladu sa odlukom Poslodavca;<br />smeštaja i ishrane za rad i boravak na terenu u skladu sa odobrenim budžetom, ako Poslodavac nije Zaposlenom obezbedio smeštaj i ishranu bez naknade;<br />Za ishranu u toku rada u iznosu od <b>« {prikaziPolje(poljaUgovorORadu.nadoknadaZaIshranu, "NADOKNADA ZA ISHRANU")} »</b> dinara BRUTO;<br />Za regres za korišćenje godišnjeg odmora u iznosu od <b>« {prikaziPolje(poljaUgovorORadu.regresZaGodisnji, "REGRES ZA KORIŠĆENJE GODIŠNJEG ODMORA")} »</b> dinara BRUTO;</div>
          <div className="text-center font-bold mb-2 mt-8">Član 10.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni ima pravo na odmor u toku dnevnog rada, dnevni odmor, nedeljni odmor i godišnji odmor u skladu sa Ugovorom o radu, Zakonom i Pravilnikom o radu.<br /><br />Zaposleni sa jednokratnim punim radnim vremenom tokom radnog dana ima pravo na odmor u trajanju od 30 minuta.<br /><br />Odmor iz stava 2. ovog člana uračunat je u radno vreme.<br /><br />Odmor u toku dnevnog rada, ne može da se koristi na početku i na kraju radnog vremena, a organizuje se na način kojim se obezbeđuje da se kontinuitet u radnom procesu ne prekida, ako priroda posla ne dozvoljava prekid rada, kao i ako se radi sa strankama.<br /><br />Odluku o rasporedu korišćenja odmora u toku dnevnog rada donosi Poslodavac ili zaposleni koga Poslodavac ovlasti.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 11.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni ima pravo na odmor između dva uzastopna radna dana u trajanju predviđenom odredbama Zakona o radu.<br /><br />Zaposleni ima pravo na nedeljni odmor u trajanju od najmanje 24 časa neprekidno.<br /><br />Ako je neophodno da Zaposleni radi na dan svog nedeljnog odmora, Poslodavac će da mu obezbedi odmor u trajanju od najmanje 24 časa neprekidno u toku naredne nedelje.<br /><br />Radni dan, po pravilu, traje 8 časova dnevno, a radna nedelja, po pravilu, 5 radnih dana.<br /><br />Poslodavac može, u skladu sa svojom organizacijom rada, predvideti drugačiji raspored radne nedelje i raspored radnog vremena, s tim da ukupno radno vreme bude 40 časova nedeljno.<br /><br />Radno vreme Zaposlenih može biti jednokratno, a rad se može organizovati i u smenama.<br /><br />Zaposleni ima pravo na godišnji odmor u skladu sa Zakonom i Pravilnikom o radu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 12.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Radni odnos zasnovan između Poslodavca i zaposlenog može prestati:<br /><br />1. istekom roka na koji je radni odnos zasnovan,<br />2. kad zaposleni navrši 65 godina života i najmanje 15 godina staža osiguranja, ako se Poslodavac i zaposleni drugačije ne sporazumeju,<br />3. sporazumom između zaposlenog i Poslodavca,<br />4. otkazom ugovora o radu od strane Poslodavca ili zaposlenog,<br />5. na zahtev roditelja ili staratelja zaposlenog mlađeg od 18 godina života,<br />6. smrću zaposlenog,<br />7. u drugim slučajevima propisanim važećim zakonima Republike Srbije.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 13.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposlenom prestaje radni odnos nezavisno od njegove volje i volje Poslodavca:<br /><br />1. ako je na način propisan Zakonom utvrđeno da je kod zaposlenog došlo do gubitka radne sposobnosti - danom dostavljanja pravnosnažnog rešenja o utvrđivanju gubitka radne sposobnosti,<br />2. ako mu je, po odredbama zakona, odnosno pravnosnažnoj odluci suda ili drugog organa, zabranjeno da obavlja određene poslove, a ne može da mu se obezbedi obavljanje drugih poslova - danom dostavljanja pravnosnažne odluke,<br />3. ako zbog izdržavanja kazne zatvora mora da bude odsutan sa rada u trajanju dužem od šest meseci - danom stupanja na izdržavanje kazne,<br />4. ako mu je izrečena mera bezbednosti, vaspitna ili zaštitna mera u trajanju dužem od šest meseci i zbog toga mora da bude odsutan sa rada - danom početka primenjivanja te mere,<br />5. u slučaju prestanka rada Poslodavca, u skladu sa Zakonom.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 14.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Radni odnos može da prestane na osnovu pisanog sporazuma Poslodavca i zaposlenog. Pre potpisivanja sporazuma, Poslodavac je dužan da zaposlenog pisanim putem obavesti o posledicama do kojih dolazi u ostvarivanju prava za slučaj nezaposlenosti.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 15.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni ima pravo da Poslodavcu otkaže ugovor o radu. Otkaz ugovora o radu zaposleni dostavlja Poslodavcu u pisanom obliku, 30 dana pre dana koji je zaposleni naveo kao dan prestanka radnog odnosa (otkazni rok).</div>
          <div className="text-center font-bold mb-2 mt-8">Član 16.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Poslodavac može da otkaže ugovor o radu zaposlenom ako teže povredi radne obaveze i to usled:<br /><br />1. neizvršavanja i/ili nesavesnog, neblagovremenog i nemarnog izvršavanja radnih obaveza i poslova utvrđenih ugovorom o radu;<br />2. zloupotrebe položaja i prekoračenja svojih ovlašćenja;<br />3. odavanja poslovne, službene ili druge tajne utvrđene Zakonom, ovim Pravilnikom ili drugim aktom Poslodavca, odnosno pokušaj odavanja podataka koji predstavljaju poslovnu tajnu, službenu ili drugu tajnu;<br />4. neovlašćeno davanje izjava u vezi sa radom sredstvima javnog informisanja;<br />5. nesavestan, nemaran i neodgovoran odnos prema imovini Poslodavca ili trećih lica odnosno klijenata i poslovnih partnera Poslodavca, koja mu je poverena (sredstva i predmeti rada);<br />6. neprijavljivanje nastale ili potencijalne štete Poslodavcu;<br />7. krađa, pokušaj krađe, utaja ili pronevera imovine Poslodavca kao i učestvovanje ili pomaganje u istom;<br />8. krađa, pokušaj krađe, utaja ili pronevera imovine klijenata i/ili poslovnih partnera Poslodavca, kao i učestvovanje ili pomaganje u istom;<br />9. korišćenje imovine Poslodavca, klijenata i/ili poslovnog partnera u privatne svrhe;<br />10. povrede klauzule zabrane konkurencije i povreda prava konkurencije;<br />11. neuredno držanje dokumentacije ili drugih sredstava rada, što je dovelo do zastoja u procesu rada;<br />12. davanje netačnih ili neproverenih podataka kada je to uticalo na donošenje odluke organa Poslodavca ili prikrivanje podataka, obaveštenja i drugih informacija koje su bitne za funkcionisanje Poslodavca;<br />13. svesno zaključivanje nepovoljnih i/ili štetnih ugovora ili davanje pogrešnih i nepotpunih podataka koji su uticali na zaključivanje takvih ugovora;<br />14. davanje i primanje mita u vezi sa radom;<br />15. rukovanje novcem i hartijama od vrednosti suprotno aktima i uputstvima Poslodavca i važećim propisima;<br />16. neprijavljivanje promena, odnosno davanje netačnih podataka o adresi prebivališta odnosno boravišta, kada zbog toga nastupe štetne posledice za Poslodavca;<br />17. politička agitacija kod Poslodavca (deljenje programa, letaka ili drugog materijala političkih stranaka i drugih političkih organizacija i sl.);<br />18. zloupotreba dnevnica za službena putovanja;<br />19. zloupotreba platnih kartica i drugih sredstava Poslodavca;<br />20. povrede koje se odnose na kršenje odredbi procedura, pravilnika, uputstava Poslodavca;<br />21. odbijanje zaposlenog da postupi po nalogu neposrednog rukovodioca, ako je nalog u vezi sa poslovima za koje je zaključio ugovor o radu;<br />22. ako necelishodno i neodgovorno koristi sredstva za rad;<br />23. ako ne koristi ili nenamenski koristi obezbeđena sredstva ili opremu za ličnu zaštitu na radu;<br />24. ako ponašanje zaposlenog predstavlja radnju izvršenja krivičnog dela učinjenog na radu i u vezi sa radom, nezavisno od toga da li je protiv zaposlenog pokrenut krivični postupak;<br />25. ako zaposleni vrši zlostavljanje ili zloupotrebljava pravo na zaštitu od zlostavljanja;<br />26. ako zaposleni odbije zahtev Poslodavca za učešće u procesu obrazovanja i stručnog usavršavanja;<br />27. u slučaju kada se za vreme pasivnog dežurstva zaposlenog javi potreba da zaposleni bude radno angažovan, a isti se ne odazove na poziv u skladu odlukom Poslodavca o pasivnom dežurstvu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 18.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposlenom koji ne poštuje radnu disciplinu odnosno čije je ponašanje takvo da ne može da nastavi<br />rad kod Poslodavca, Poslodavac može da otkaže ugovor o radu, a naročito u sledećim slučajevima:<br /><br />1. netačno evidentiranje i prikazivanje rezultata rada;<br />2. ometanje zaposlenih u procesu rada, čime se remeti izvršenje njihovih radnih obaveza;<br />3. odbijanje saradnje ili nedolično ponašanje prema zaposlenima kod Poslodavca, drugim licima angažovanim kod Poslodavca i/ili strankama kao što su svađa, psovke, nepristojno obraćanje, kleveta, uvreda i slično;<br />4. izazivanje nereda ili tuče, kao i učestvovanje u tuči kod Poslodavca;<br />5. obavljanje ličnih (privatnih) poslova u radno vreme;<br />6. neizvršavanje poslova u vreme štrajka radi obezbeđivanja minimuma procesa rada;<br />7. nerazduživanje sredstava za rad za vreme dužeg odsustvovanja sa posla;<br />8. ako ne dostavi potvrdu o privremenoj sprečenosti za rad u roku od 3 dana od nastupanja sprečenosti za rad;<br />9. ako zloupotrebi pravo na odsustvo zbog privremene sprečenosti za rad;<br />10. ako se zaposleni ne vrati na rad kod Poslodavca u roku od 15 dana od dana isteka roka za neplaćeno odsustvo ili mirovanje radnog odnosa;<br />11. kocka se ili puši u prostorijama Poslodavca, spava u toku radnog vremena;<br />12. dolazi na rad pod dejstvom alkohola ili drugih opojnih sredstava, odnosno upotrebe alkohola ili drugih opojnih sredstava u toku radnog vremena;<br />13. ako je dao netačne podatke koji su bili odlučujući za zasnivanje radnog odnosa;<br />14. ako zaposleni koji radi na poslovima sa povećanim rizikom, na kojima je kao poseban uslov za rad utvrđena posebna zdravstvena sposobnost, odbije da bude podvrgnut oceni zdravstvene sposobnosti;<br />15. ako ne poštuje radnu disciplinu propisanu aktom Poslodavca, odnosno ako je njegovo ponašanje takvo da ne može da nastavi rad kod Poslodavca;<br />16. neopravdano zakasni na posao tri puta u toku meseca ili ukupno pet puta u kalendarskoj godini; ili odlazak sa posla pre isteka radnog vremena više od tri puta u toku jednog meseca, odnosno pet puta u toku godine;<br />17. neopravdano izostane sa posla tri radna dana u toku kalendarske godine;<br />18. neuredno održava prostor u kome su smeštene stvari, roba, dokumentacija i dr., a što ima za posledicu oštećenje stvari, robe, dokumentacije i dr.<br />19. postupanje zaposlenog koje vodi narušavanju ugleda Poslodavca, kao i postupanje zaposlenog koje za posledicu ima narušen poslovni ugled Poslodavca.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 19.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni je obavezan da u slučaju prestanka radnog odnosa Poslodavcu odmah preda sav pribor i opremu kojom je zadužen, sve projekte na kojima je radio kao i svu poslovnu i drugu dokumentaciju Poslodavca u čijem se posedu nalazi.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 20.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni je dužan da kvalitetno izvrši primopredaju dužnosti novom licu na tom radnom mestu i isto uputi u sve poslove koje je obavljao za Poslodavca tokom svog rada.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 21.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Poslodavac se obavezuje da obezbedi i sprovodi zaštitu na radu u skladu sa zakonom i opštim aktima poslodavca, a Zaposleni je dužan da se pridržava propisanih mera zaštite na radu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 22.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni potvrđuje da je upoznat sa sadržinom Pravilnika o radu i svih ostalih opštih akata Poslodavca, te da ga Poslodavac obavestio o poslu, uslovima rada, pravima i obavezama iz radnog odnosa, kako je to predviđeno odredbama Zakona o radu i Pravilnikom o radu. Poslodavac se obavezuje da omogući Zaposlenom ostvarivanje prava propisanih Pravilnikom o radu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 23.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Zaposleni je odgovoran za štetu koju na radu ili u vezi sa radom, namerno ili iz krajnje nepažnje prouzrokovao Poslodavcu. Zaposleni je dužan da Poslodavcu nadoknadi štetu koju je namerno ili krajnjom nepažnjom prouzrokovao trećem licu, a koju je nadoknadio Poslodavac.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 24.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Na prava i obaveze koja nisu utvrđena ovim Ugovorom o radu primenjivaće se odgovarajuće odredbe Zakona o radu i Pravilnika o radu.</div>
          <div className="text-center font-bold mb-2 mt-8">Član 25.</div>
          <div className="mb-4 max-w-3xl mx-auto text-center">Ovaj Ugovor o radu je sačinjen u tri primerka od kojih jedan zadržava Zaposleni, a dva Poslodavac.</div>
          <div className="flex justify-between w-full max-w-3xl mt-8">
            <div>
              Zaposleni:<br />
              <span className="inline-block border-t border-gray-400 w-60 mt-6"></span>
            </div>
            <div className="text-right">
              Za poslodavca:<br />
              <span className="inline-block border-t border-gray-400 w-60 mt-6"></span><br />
              Direktor <b>« {prikaziPolje(poljaUgovorORadu.direktor, "IME I PREZIME DIREKTORA")} »</b>
            </div>
          </div>
        </div>
        <PoljaForm
          open={showPoljaUgovorORadu}
          onClose={() => setShowPoljaUgovorORadu(false)}
          values={poljaUgovorORadu}
          onChange={v => setPoljaUgovorORadu(v as PoljaUgovorORaduFormValues)}
          docType="ugovor-o-radu"
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
                {idx === 0 ? <PlanGodisnjegOdmoraDynamic /> : idx === 1 ? <UgovorVoziloDynamic /> : idx === 2 ? <ResenjeOdsustvoDynamic /> : idx === 3 ? <ResenjeZamenaGodisnjiDynamic /> : idx === 4 ? <UgovorORaduDynamic /> : <div className="p-6 text-[var(--text-secondary)] text-base">Nema podataka za ovaj dokument.</div>}
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