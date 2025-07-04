"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RegistracijaPage() {
  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [telefon, setTelefon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Uvek koristi light mod
    document.documentElement.classList.remove("dark");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const res = await fetch("/api/registracija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ime, prezime, email, lozinka, telefon }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Greška pri registraciji.");
      return;
    }
    setSuccess("Uspešna registracija! Preusmeravam...");
    setTimeout(() => window.location.replace("/"), 1000);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60 relative">
      <header className="flex flex-col items-center mb-8 select-none">
        <span className="text-2xl font-extrabold tracking-widest text-primary-700" style={{letterSpacing: '0.18em', fontFamily: 'InterVariable, sans-serif'}}>HR PLATFORMA</span>
      </header>
      <Card className={cn("w-[430px] max-w-full h-[420px] px-8 py-8 mx-auto shadow-2xl glassmorphism border-none bg-white/70 backdrop-blur-lg animate-fade-in-up flex flex-col justify-center items-center")}> 
        <CardHeader className="flex justify-center">
          <CardTitle className="text-3xl font-extrabold text-center text-black tracking-tight">Registracija</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Ime"
                value={ime}
                onChange={e => setIme(e.target.value)}
                required
                className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400 py-3 text-lg font-bold"
              />
              <Input
                type="text"
                placeholder="Prezime"
                value={prezime}
                onChange={e => setPrezime(e.target.value)}
                required
                className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400 py-3 text-lg font-bold"
              />
            </div>
            <Input
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400 py-3 text-lg font-bold"
            />
            <Input
              type="password"
              placeholder="Lozinka"
              value={lozinka}
              onChange={e => setLozinka(e.target.value)}
              required
              className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400 py-3 text-lg font-bold"
            />
            <Input
              type="tel"
              placeholder="Telefon (opciono)"
              value={telefon}
              onChange={e => setTelefon(e.target.value)}
              className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400 py-3 text-lg font-bold"
            />
            {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
            {success && <div className="text-green-600 text-center font-semibold animate-fade-in-up">{success}</div>}
            <Button type="submit" className="w-full rounded-xl text-lg font-bold shadow-lg bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-200 text-black hover:text-white" disabled={loading}>
              {loading ? "Registrujem..." : "Registruj se"}
            </Button>
            <div className="text-center mt-2">
              <span className="text-muted-foreground">Već imate nalog?</span>{" "}
              <a href="/prijava" className="text-primary-600 hover:underline font-semibold">Prijavite se</a>
            </div>
          </form>
        </CardContent>
      </Card>
      <style jsx global>{`
        .glassmorphism {
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.3s linear;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
} 