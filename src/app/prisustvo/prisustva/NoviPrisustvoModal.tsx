import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function NoviPrisustvoModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ korisnik_id: "", lokacija: "", datum_pocetka: "", datum_zavrsetka: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [korisnici, setKorisnici] = useState<string[]>([]);
  const [lokacije] = useState<string[]>(["Niš", "Beograd", "Novi Sad"]); // primer

  useEffect(() => {
    fetch("/api/korisnici")
      .then(res => res.json())
      .then(res => setKorisnici(res));
    // Lokacije možeš fetchovati iz baze ako imaš API, ovde je primer.
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/prisustva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Greška prilikom čuvanja.");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Greška prilikom čuvanja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <Card className="w-[600px] p-8 relative rounded-2xl shadow-xl">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-3xl font-bold mb-6">Novo prisustvo</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Kandidat</label>
              <select className="w-full border rounded px-3 py-2" value={form.korisnik_id} onChange={e => setForm(f => ({ ...f, korisnik_id: e.target.value }))} required>
                <option value="">Izaberi kandidata</option>
                {korisnici.map((k: string) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Lokacija</label>
              <select className="w-full border rounded px-3 py-2" value={form.lokacija} onChange={e => setForm(f => ({ ...f, lokacija: e.target.value }))} required>
                <option value="">Izaberi lokaciju</option>
                {lokacije.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Datum početka</label>
              <Input type="datetime-local" className="w-full" value={form.datum_pocetka} onChange={e => setForm(f => ({ ...f, datum_pocetka: e.target.value }))} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Datum završetka</label>
              <Input type="datetime-local" className="w-full" value={form.datum_zavrsetka} onChange={e => setForm(f => ({ ...f, datum_zavrsetka: e.target.value }))} required />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-4 justify-end mt-4">
            <Button type="submit" className="px-8 py-2 text-lg" disabled={loading}>{loading ? "Čuvanje..." : "Sačuvaj"}</Button>
            <Button type="button" variant="outline" className="px-8 py-2 text-lg" onClick={onClose}>Otkaži</Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 