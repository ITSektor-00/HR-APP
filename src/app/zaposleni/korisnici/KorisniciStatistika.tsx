import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';

interface Korisnik {
  pol?: string;
  sektor?: string;
  status_zaposlenja?: string;
  uloga?: string;
}

interface Props {
  korisnici: Korisnik[];
}

const COLORS = ['#6366f1', '#f87171', '#a78bfa', '#fbbf24'];

const KorisniciStatistika: React.FC<Props> = ({ korisnici }) => {
  // Statistika po polu
  const polCounts: Record<string, number> = {};
  korisnici.forEach(k => {
    const pol = k.pol || 'Nepoznato';
    polCounts[pol] = (polCounts[pol] || 0) + 1;
  });
  const polData = Object.entries(polCounts).map(([name, value]) => ({ name, value }));

  // Statistika po sektorima
  const sektorCounts: Record<string, number> = {};
  korisnici.forEach(k => {
    const sektor = k.sektor || 'Nepoznato';
    sektorCounts[sektor] = (sektorCounts[sektor] || 0) + 1;
  });
  const sektorData = Object.entries(sektorCounts).map(([name, value]) => ({ name, value }));

  // Statistika po statusu zaposlenja
  const statusCounts: Record<string, number> = {};
  korisnici.forEach(k => {
    const status = k.status_zaposlenja || 'Nepoznato';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Statistika po ulozi
  const ulogaCounts: Record<string, number> = {};
  korisnici.forEach(k => {
    const uloga = k.uloga || 'Nepoznato';
    ulogaCounts[uloga] = (ulogaCounts[uloga] || 0) + 1;
  });
  const ulogaData = Object.entries(ulogaCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex items-center gap-2 mb-8">
        <Image src="/statistic.svg" alt="Statistika" width={36} height={36} />
        <span className="text-3xl font-semibold">Statistika korisnika</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 pb-8">
        {/* Polna struktura */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Polna struktura</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={polData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {polData.map((entry, idx) => (
                  <Cell key={`cell-pol-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {polData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Po sektorima */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Po sektorima</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={sektorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {sektorData.map((entry, idx) => (
                  <Cell key={`cell-sektor-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {sektorData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{background: COLORS[idx % COLORS.length]}}></span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Po statusu zaposlenja */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Status zaposlenja</span>
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
        {/* Po ulozi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-w-[320px] min-h-[380px]">
          <span className="font-bold mb-6 text-xl">Po ulozi</span>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie data={ulogaData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {ulogaData.map((entry, idx) => (
                  <Cell key={`cell-uloga-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-base font-semibold">
            {ulogaData.map((entry, idx) => (
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

export default KorisniciStatistika; 