import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Korisnik {
  id: number;
  ime: string;
  prezime: string;
}

interface Prisustvo {
  id: number;
  korisnik: string;
  lokacija: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  datum_kreiranja: string;
  datum_azuriranja: string;
  [key: string]: string | number;
}

const initialColumns = [
  { key: "korisnik", label: "Korisnik", visible: true },
  { key: "lokacija", label: "Lokacija", visible: true },
  { key: "datum_pocetka", label: "Datum početka", visible: true },
  { key: "datum_zavrsetka", label: "Datum završetka", visible: true },
  { key: "datum_kreiranja", label: "Datum kreiranja", visible: true },
  { key: "datum_azuriranja", label: "Datum ažuriranja", visible: true },
];

export default function PrisustvaTable({ onAdd }: { onAdd: () => void }) {
  const [columns, setColumns] = useState(initialColumns);
  const [showColumns, setShowColumns] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({ korisnik: "", lokacija: "", datum_pocetka: "", datum_zavrsetka: "", datum_kreiranja: "", datum_azuriranja: "" });
  const [data, setData] = useState<Prisustvo[]>([]);
  const [loading, setLoading] = useState(true);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [lokacije] = useState<string[]>(["Niš", "Beograd", "Novi Sad"]); // primer

  useEffect(() => {
    setLoading(true);
    fetch("/api/prisustva")
      .then(res => res.json())
      .then(res => setData(res))
      .finally(() => setLoading(false));
    fetch("/api/korisnici")
      .then(res => res.json())
      .then(res => setKorisnici(res));
    // Lokacije možeš fetchovati iz baze ako imaš API, ovde je primer.
  }, []);

  const filtered = data.filter(row =>
    columns.every(col => !col.visible || !filters[col.key] || (row[col.key]?.toString().toLowerCase().includes(filters[col.key].toLowerCase())))
  );

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4 items-center">
        <Button variant="outline" onClick={() => setShowColumns(!showColumns)}>
          Kolone <span className="ml-1">{columns.filter(c => c.visible).length}</span>
        </Button>
        <Button variant="outline" onClick={onAdd}>Novo prisustvo</Button>
        <Button variant="outline" onClick={() => setShowFilters(f => !f)}>Filteri</Button>
        {showColumns && (
          <div className="absolute bg-white border rounded shadow p-4 z-10 mt-10">
            <div className="mb-2 font-semibold">Prikaz kolona</div>
            {columns.map((col, idx) => (
              <div key={col.key} className="flex items-center gap-2 mb-1">
                <input type="checkbox" checked={col.visible} onChange={() => {
                  setColumns(columns.map((c, i) => i === idx ? { ...c, visible: !c.visible } : c));
                }} />
                <span>{col.label}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 text-xs">
              <button onClick={() => setColumns(columns.map(c => ({ ...c, visible: true })))} className="text-blue-600">Prikaži sve</button>
              <button onClick={() => setColumns(columns.map(c => ({ ...c, visible: false })))} className="text-blue-600">Sakrij sve</button>
            </div>
          </div>
        )}
      </div>
      {showFilters && (
        <Card className="mb-4 p-4 bg-gray-50 rounded-xl shadow flex flex-col">
          <div className="grid grid-cols-6 gap-2 mb-2">
            <select
              className="border rounded px-2 py-1"
              value={filters.korisnik}
              onChange={e => setFilters(f => ({ ...f, korisnik: e.target.value }))}
            >
              <option value="">Korisnik</option>
              {korisnici.map((k: Korisnik) => (
                <option key={k.id} value={k.ime + ' ' + k.prezime}>{k.ime + ' ' + k.prezime}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={filters.lokacija}
              onChange={e => setFilters(f => ({ ...f, lokacija: e.target.value }))}
            >
              <option value="">Lokacija</option>
              {lokacije.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <Input type="date" placeholder="Datum početka" value={filters.datum_pocetka} onChange={e => setFilters(f => ({ ...f, datum_pocetka: e.target.value }))} />
            <Input type="date" placeholder="Datum završetka" value={filters.datum_zavrsetka} onChange={e => setFilters(f => ({ ...f, datum_zavrsetka: e.target.value }))} />
            <Input type="date" placeholder="Datum kreiranja" value={filters.datum_kreiranja} onChange={e => setFilters(f => ({ ...f, datum_kreiranja: e.target.value }))} />
            <Input type="date" placeholder="Datum ažuriranja" value={filters.datum_azuriranja} onChange={e => setFilters(f => ({ ...f, datum_azuriranja: e.target.value }))} />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowFilters(false)}>Zatvori filtere</Button>
          </div>
        </Card>
      )}
      {loading ? (
        <div className="text-center py-8">Učitavanje...</div>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr>
              {columns.map(col => col.visible && (
                <th key={col.key} className="p-2 border-b font-semibold text-left">{col.label}</th>
              ))}
              <th className="p-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                {columns.map(col => col.visible && (
                  <td key={col.key} className="p-2 border-b">
                    {col.key === "korisnik" && row.korisnik ? (
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-yellow-300 text-black font-bold w-8 h-8 flex items-center justify-center">
                          {row.korisnik.split(" ").map((s: string) => s[0]).join("")}
                        </span>
                        {row.korisnik}
                      </span>
                    ) : row[col.key]}
                  </td>
                ))}
                <td className="p-2 border-b">
                  <Button size="icon" variant="ghost" asChild>
                    <a href={`/prisustvo/prisustva/${row.id}`} title="Detalji">
                      <span role="img" aria-label="detalji">👁️</span>
                    </a>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex items-center justify-between mt-4">
        <div>Ukupno stavki: {filtered.length}</div>
        <div className="flex items-center gap-2">
          <span>Broj redova:</span>
          <select className="border rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </Card>
  );
} 