export default function KorisniciDokumenti() {
  return (
    <div className="text-[var(--text-primary)] p-6">
      <h1 className="text-3xl font-bold mb-6">Dokumenti korisnika</h1>
      
      <div className="bg-[var(--bg-secondary)] rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Test stranica</h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Ovo je test stranica za rutu /korisnici/dokumenti. Ako vidite ovu poruku, 
          rutiranje radi ispravno!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
            <h3 className="font-medium mb-2">Ugovori</h3>
            <p className="text-sm text-[var(--text-secondary)]">Pregled ugovora korisnika</p>
          </div>
          
          <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
            <h3 className="font-medium mb-2">Sertifikati</h3>
            <p className="text-sm text-[var(--text-secondary)]">Sertifikati i obuke</p>
          </div>
          
          <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
            <h3 className="font-medium mb-2">Dokumenti</h3>
            <p className="text-sm text-[var(--text-secondary)]">Ostali dokumenti</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-medium">
            ✅ Ruta /korisnici/dokumenti je uspešno kreirana i radi!
          </p>
        </div>
      </div>
    </div>
  );
} 