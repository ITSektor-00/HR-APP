"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Prisustvo {
  id: number;
  korisnik_id: number;
  lokacija: string;
  datum_pocetka: string;
  datum_zavrsetka: string;
  created_at: string;
  updated_at: string;
}

export default function PrisustvoDetaljiPage() {
  const params = useParams();
  const [prisustvo, setPrisustvo] = useState<Prisustvo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrisustvo = async () => {
      try {
        const res = await fetch(`/api/prisustva/${params.id}`);
        if (!res.ok) {
          throw new Error('Prisustvo nije pronađeno');
        }
        const data = await res.json();
        setPrisustvo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Greška pri učitavanju');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPrisustvo();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  if (!prisustvo) {
    return (
      <div className="p-8">
        <div className="text-center py-8">Prisustvo nije pronađeno</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Detalji prisustva</h1>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Lokacija</h3>
            <p className="text-gray-600">{prisustvo.lokacija}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Datum početka</h3>
            <p className="text-gray-600">
              {new Date(prisustvo.datum_pocetka).toLocaleString('sr-RS')}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Datum završetka</h3>
            <p className="text-gray-600">
              {prisustvo.datum_zavrsetka 
                ? new Date(prisustvo.datum_zavrsetka).toLocaleString('sr-RS')
                : 'Nije završeno'
              }
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Datum kreiranja</h3>
            <p className="text-gray-600">
              {new Date(prisustvo.created_at).toLocaleString('sr-RS')}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Nazad
          </Button>
        </div>
      </Card>
    </div>
  );
} 