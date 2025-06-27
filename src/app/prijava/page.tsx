"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function PrijavaPage() {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // Proveri localStorage ili sistemsku temu
    const saved = typeof window !== 'undefined' ? localStorage.getItem("auth-theme") : null;
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  function toggleTheme() {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("auth-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("auth-theme", "light");
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
    window.location.replace("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100/80 to-primary-300/60 dark:from-primary-900/80 dark:to-primary-700/60 relative">
      {/* Header sa logom i natpisom */}
      <header className="flex flex-col items-center mt-16 mb-10 select-none">
        <span className="block w-12 h-12 mb-2 drop-shadow-lg transition-all duration-500 animate-fade-in hover:scale-110" style={{display: 'inline-block'}}>
          <svg height="48" width="48" viewBox="0 0 40 41" xmlns="http://www.w3.org/2000/svg" style={{width: '100%', height: '100%'}}>
            <path clipRule="evenodd" d="M 13.7146 0.516113 C 11.4582 0.516113 9.2943 1.41245 7.69881 3.00794 L 0 10.7067 V 14.2307 C 0 16.7204 1.06944 18.9603 2.77401 20.5161 C 1.06944 22.0719 0 24.3118 0 26.8015 V 30.3255 L 7.69881 38.0243 C 9.2943 39.6198 11.4582 40.5161 13.7146 40.5161 C 16.2043 40.5161 18.4442 39.4467 20 37.7421 C 21.5558 39.4467 23.7957 40.5161 26.2854 40.5161 C 28.5418 40.5161 30.7057 39.6198 32.3012 38.0243 L 40 30.3255 V 26.8015 C 40 24.3118 38.9306 22.0719 37.226 20.5161 C 38.9306 18.9603 40 16.7204 40 14.2307 V 10.7067 L 32.3012 3.00794 C 30.7057 1.41245 28.5418 0.516113 26.2854 0.516113 C 23.7957 0.516113 21.5558 1.58555 20 3.29012 C 18.4442 1.58555 16.2043 0.516113 13.7146 0.516113 Z M 25.7588 20.5161 C 25.6629 20.4286 25.5688 20.3387 25.4766 20.2465 L 20 14.7699 L 14.5234 20.2465 C 14.4312 20.3387 14.3371 20.4286 14.2412 20.5161 C 14.3371 20.6036 14.4312 20.6935 14.5234 20.7857 L 20 26.2623 L 25.4766 20.7857 C 25.5688 20.6935 25.6629 20.6036 25.7588 20.5161 Z M 22.2222 30.3255 L 22.2222 32.0085 C 22.2222 34.2525 24.0414 36.0717 26.2854 36.0717 C 27.363 36.0717 28.3965 35.6436 29.1585 34.8816 L 35.5556 28.4845 V 26.8015 C 35.5556 24.5575 33.7364 22.7383 31.4924 22.7383 C 30.4148 22.7383 29.3813 23.1664 28.6193 23.9284 L 22.2222 30.3255 Z M 17.7778 30.3255 L 11.3807 23.9284 C 10.6187 23.1664 9.58524 22.7383 8.50762 22.7383 C 6.26359 22.7383 4.44444 24.5575 4.44444 26.8015 V 28.4845 L 10.8415 34.8816 C 11.6035 35.6436 12.637 36.0717 13.7146 36.0717 C 15.9586 36.0717 17.7778 34.2525 17.7778 32.0085 V 30.3255 Z M 17.7778 9.02373 V 10.7067 L 11.3807 17.1038 C 10.6187 17.8658 9.58524 18.2939 8.50762 18.2939 C 6.26359 18.2939 4.44444 16.4747 4.44444 14.2307 V 12.5477 L 10.8415 6.15063 C 11.6035 5.38864 12.637 4.96056 13.7146 4.96056 C 15.9586 4.96056 17.7778 6.7797 17.7778 9.02373 Z M 28.6193 17.1038 L 22.2222 10.7067 L 22.2222 9.02373 C 22.2222 6.7797 24.0414 4.96056 26.2854 4.96056 C 27.363 4.96056 28.3965 5.38864 29.1585 6.15063 L 35.5556 12.5477 V 14.2307 C 35.5556 16.4747 33.7364 18.2939 31.4924 18.2939 C 30.4148 18.2939 29.3813 17.8658 28.6193 17.1038 Z" fill="#3A3CA6" fillRule="evenodd" />
          </svg>
        </span>
        <span className="text-2xl font-extrabold tracking-widest text-primary-700 dark:text-primary-200" style={{letterSpacing: '0.18em', fontFamily: 'InterVariable, sans-serif'}}>HR PLATFORMA</span>
      </header>
      {/* Diskretno dugme za promenu teme */}
      <button
        onClick={toggleTheme}
        aria-label="Promeni temu"
        className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/70 dark:bg-primary-900/80 shadow-md hover:scale-105 transition-all border border-gray-200 dark:border-primary-800 focus:outline-none group"
        style={{backdropFilter: 'blur(6px)'}}
      >
        {/* Sunce za svetli režim */}
        <svg
          className={`w-5 h-5 text-yellow-400 transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        {/* Mesec za tamni režim */}
        <svg
          className={`w-5 h-5 text-primary-200 absolute transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <Card className={cn("w-[370px] h-[340px] shadow-2xl glassmorphism border-none bg-white/70 dark:bg-primary-950/80 backdrop-blur-lg animate-fade-in-up flex flex-col justify-center")}> 
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-black dark:text-white tracking-tight drop-shadow-lg">Prijava</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email adresa"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Lozinka"
                value={lozinka}
                onChange={e => setLozinka(e.target.value)}
                required
                className="rounded-xl shadow-inner focus:ring-2 focus:ring-primary-400"
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