import { 
  Users, 
  FileText, 
  Calendar, 
  Car, 
  Building2, 
  Clock, 
  Briefcase, 
  GraduationCap,
  Shield,
  CreditCard,
  UserPlus,
  Plus
} from "lucide-react";

export default function Home() {
  const hrModules = [
    {
      icon: Users,
      title: "Zaposleni",
      description: "Upravljanje podacima o zaposlenima",
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      icon: FileText,
      title: "Ugovori",
      description: "Praćenje ugovora o radu",
      color: "from-green-500/20 to-green-600/10"
    },
    {
      icon: Calendar,
      title: "Odsustva",
      description: "Evidencija odmora i bolovanja",
      color: "from-purple-500/20 to-purple-600/10"
    },
    {
      icon: Car,
      title: "Registracije vozila",
      description: "Upravljanje službenim vozilima",
      color: "from-orange-500/20 to-orange-600/10"
    },
    {
      icon: Building2,
      title: "Organizaciona struktura",
      description: "Hijerarhija i organizacija",
      color: "from-teal-500/20 to-teal-600/10"
    },
    {
      icon: Clock,
      title: "Evidencija rada",
      description: "Praćenje radnog vremena",
      color: "from-indigo-500/20 to-indigo-600/10"
    },
    {
      icon: Briefcase,
      title: "Pozicije",
      description: "Radna mesta i opisi posla",
      color: "from-cyan-500/20 to-cyan-600/10"
    },
    {
      icon: GraduationCap,
      title: "Obuke",
      description: "Upravljanje edukacijom",
      color: "from-pink-500/20 to-pink-600/10"
    },
    {
      icon: Shield,
      title: "Bezbednost",
      description: "Sigurnost i compliance",
      color: "from-red-500/20 to-red-600/10"
    },
    {
      icon: CreditCard,
      title: "Plate",
      description: "Obračun plata i beneficija",
      color: "from-yellow-500/20 to-yellow-600/10"
    },
    {
      icon: UserPlus,
      title: "Regrutovanje",
      description: "Proces zapošljavanja",
      color: "from-emerald-500/20 to-emerald-600/10"
    },
    {
      icon: Plus,
      title: "Dodaj modul",
      description: "Kreiraj custom modul",
      color: "from-gray-500/20 to-gray-600/10"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/5 to-transparent rounded-full transform -translate-x-16 translate-y-16" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* Header Content */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
            <Users className="w-4 h-4" />
            <span className="text-sm">HR Upravljanje</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Upravljanje Zaposlenima
          </h1>
          
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            Sveobuhvatan sistem za upravljanje ljudskim resursima sa modulima prilagođenim vašim potrebama
          </p>
        </div>

        {/* HR Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {hrModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={index}
                className={`group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4 cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:bg-white/15 hover:scale-105 hover:shadow-2xl
                  hover:animate-pulse
                  border border-white/10 hover:border-white/20`}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold group-hover:text-white transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                      {module.description}
                    </p>
                  </div>
                </div>

                {/* Pulse ring effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 group-hover:animate-ping" />
              </div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-16 pt-8 border-t border-white/20 text-center">
          <p className="text-white/60">
            Sistem se prilagođava vašim potrebama - dodajte nove module kako vaša organizacija raste
          </p>
        </div>
      </div>
    </div>
  );
}
