"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";

export default function PrijavaPage() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Uvek koristi light mod
    document.documentElement.classList.remove("dark");
    
    // Proveri da li je korisnik već prijavljen
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      const res = await fetch("/api/provera-stanja", {
        credentials: "include",
      });
      const data = await res.json();
      
      if (data.isLoggedIn) {
        // Preusmeri na glavnu stranicu ako je već prijavljen
        window.location.replace("/");
        return;
      }
    } catch (error) {
      console.error("Greška pri proveri stanja:", error);
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/prijava", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lozinka }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Greška pri prijavi.");
      return;
    }
    // Samo redirectuj na home page
    window.location.replace("/?prijava=uspesna");
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60 relative">
      <header className="flex flex-col items-center mb-8 select-none">
        <div className="relative group">
          <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={64} 
            height={64} 
            className="mb-2 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse cursor-pointer" 
          />
          <div className="absolute inset-0 rounded-full bg-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
        </div>
        <span className="text-xl font-semibold tracking-widest text-[#3A3CA6]" style={{letterSpacing: '0.18em', fontFamily: 'InterVariable, sans-serif'}}>HR PLATFORMA</span>
      </header>
      <Card className={cn("w-[370px] h-[340px] shadow-2xl glassmorphism border-none bg-white/70 backdrop-blur-lg animate-fade-in-up flex flex-col justify-center")}> 
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-black tracking-tight drop-shadow-lg">Prijava</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email adresa"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-10 rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="password"
                placeholder="Lozinka"
                value={lozinka}
                onChange={e => setLozinka(e.target.value)}
                required
                className="pl-10 rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400"
              />
            </div>
            {error && <div className="text-red-500 text-center font-semibold animate-shake">{error}</div>}
            <Button type="submit" className="w-full rounded-xl text-lg font-bold shadow-lg bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 transition-all duration-200 text-black hover:text-white" disabled={loading}>
              {loading ? "Prijavljivanje..." : "Prijavi se"}
            </Button>
            <div className="text-center mt-2">
              <span className="text-muted-foreground">Nemate nalog?</span>{" "}
              <a href="/registracija" className="text-primary-600 hover:underline font-semibold">Registrujte se</a>
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
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
} 