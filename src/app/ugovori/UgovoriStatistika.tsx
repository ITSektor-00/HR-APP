import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

interface Ugovor {
  tip_ugovora?: string;
  status?: string;
  datum_pocetka?: string;
  datum_zavrsetka?: string;
}

interface Props {
  ugovori: Ugovor[];
}

const COLORS = ['#6366f1', '#f87171', '#a78bfa', '#fbbf24', '#34d399', '#f59e0b'];

const UgovoriStatistika: React.FC<Props> = ({ ugovori }) => {
  // Statistika po tipu ugovora
  const tipUgovoraCounts: Record<string, number> = {};
  ugovori.forEach(u => {
    const tip = u.tip_ugovora || 'Nepoznato';
    tipUgovoraCounts[tip] = (tipUgovoraCounts[tip] || 0) + 1;
  });
  const tipUgovoraData = Object.entries(tipUgovoraCounts).map(([name, value]) => ({ name, value }));

  // Statistika po statusu ugovora
  const statusCounts: Record<string, number> = {};
  ugovori.forEach(u => {
    const status = u.status || 'Nepoznato';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Statistika po godini početka
  const godinaPocetkaCounts: Record<string, number> = {};
  ugovori.forEach(u => {
    if (u.datum_pocetka) {
      const godina = new Date(u.datum_pocetka).getFullYear().toString();
      godinaPocetkaCounts[godina] = (godinaPocetkaCounts[godina] || 0) + 1;
    }
  });
  const godinaPocetkaData = Object.entries(godinaPocetkaCounts).map(([name, value]) => ({ name, value }));

  // Statistika po godini završetka
  const godinaZavrsetkaCounts: Record<string, number> = {};
  ugovori.forEach(u => {
    if (u.datum_zavrsetka) {
      const godina = new Date(u.datum_zavrsetka).getFullYear().toString();
      godinaZavrsetkaCounts[godina] = (godinaZavrsetkaCounts[godina] || 0) + 1;
    }
  });
  const godinaZavrsetkaData = Object.entries(godinaZavrsetkaCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-2 mb-8">
        <Image src="/statistic.svg" alt="Statistika" width={36} height={36} />
        <span className="text-3xl font-semibold">Statistika ugovora</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-8">
        {/* Po tipu ugovora */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Po tipu ugovora</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={tipUgovoraData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {tipUgovoraData.map((entry, idx) => (
                  <Cell key={`cell-tip-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {tipUgovoraData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Po statusu ugovora */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Status ugovora</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {statusData.map((entry, idx) => (
                  <Cell key={`cell-status-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {statusData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Po godini početka */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Godina početka</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={godinaPocetkaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {godinaPocetkaData.map((entry, idx) => (
                  <Cell key={`cell-godina-pocetak-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {godinaPocetkaData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Po godini završetka */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Godina završetka</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={godinaZavrsetkaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {godinaZavrsetkaData.map((entry, idx) => (
                  <Cell key={`cell-godina-zavrsetak-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {godinaZavrsetkaData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UgovoriStatistika; 