"use client";
import PrisustvaTable from "./PrisustvaTable";
import NoviPrisustvoModal from "./NoviPrisustvoModal";
import { useState } from "react";

export default function PrisustvaPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="p-8">
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-lg" style={{ background: '#3A3CA6' }}>
            <svg fill="#ffffff" width="40" height="40" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <g> <path d="M52.199,48.02c-0.547-0.102-1.069,0.241-1.18,0.781C49.903,54.303,45.574,58,40.249,58c-5.028,0-9.446-3.3-10.948-8H34v-2 h-8v8h2v-3.849C30.169,56.833,34.915,60,40.249,60c6.304,0,11.42-4.341,12.731-10.801C53.09,48.657,52.74,48.13,52.199,48.02z"></path> <path d="M52,40.309C49.75,35.854,45.296,33,40.249,33c-6.109,0-11.541,3.997-13.209,9.721c-0.154,0.53,0.15,1.085,0.681,1.239 c0.531,0.156,1.085-0.15,1.239-0.681C30.358,38.482,35.105,35,40.249,35c4.565,0,8.562,2.766,10.33,7H46v2h8v-8h-2V40.309z"></path> <path d="M29,26.021c-1.44,0.374-2.567,1.521-2.896,2.979H19c-0.553,0-1,0.447-1,1s0.447,1,1,1h7.18 c0.488,1.658,2.006,2.879,3.82,2.879c2.206,0,4-1.794,4-4c0-1.859-1.279-3.411-3-3.858V15.879c0-0.553-0.447-1-1-1s-1,0.447-1,1 V26.021z M32,29.879c0,1.103-0.897,2-2,2s-2-0.897-2-2s0.897-2,2-2S32,28.776,32,29.879z"></path> <path d="M30,9.879c0.553,0,1-0.447,1-1v-1c0-0.553-0.447-1-1-1s-1,0.447-1,1v1C29,9.432,29.447,9.879,30,9.879z"></path> <path d="M52,30.879c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1c-0.553,0-1,0.447-1,1s0.447,1,1,1H52z"></path> <path d="M8,28.879c-0.553,0-1,0.447-1,1s0.447,1,1,1h1c0.553,0,1-0.447,1-1s-0.447-1-1-1H8z"></path> <path d="M45.557,15.736l0.707-0.707c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0l-0.707,0.707 c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293S45.361,15.932,45.557,15.736z"></path> <path d="M14.443,44.021l-0.707,0.707c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293 c0.256,0,0.512-0.098,0.707-0.293l0.707-0.707c0.391-0.391,0.391-1.023,0-1.414S14.834,43.63,14.443,44.021z"></path> <path d="M15.857,14.322l-0.707-0.707c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414l0.707,0.707 c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293C16.248,15.346,16.248,14.713,15.857,14.322z"></path> <path d="M30,0C13.458,0,0,13.458,0,30c0,13.825,9.36,25.8,22.763,29.121c0.08,0.02,0.161,0.029,0.241,0.029 c0.448,0,0.856-0.305,0.97-0.76c0.133-0.536-0.194-1.078-0.73-1.211C10.735,54.081,2,42.904,2,30C2,14.561,14.561,2,30,2 s28,12.561,28,28c0,3.468-0.634,6.863-1.883,10.094c-0.199,0.515,0.057,1.094,0.572,1.293c0.512,0.199,1.094-0.058,1.293-0.572 C59.321,37.354,60,33.715,60,30C60,13.458,46.542,0,30,0z"></path> </g>
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Prisustva</h1>
          </div>
        </div>
        <button className="ml-auto btn btn-primary text-lg px-6 py-3" onClick={() => setShowModal(true)}>
          + Novo prisustvo
        </button>
        <button className="btn btn-secondary text-lg px-6 py-3">Izvoz</button>
      </div>
      <PrisustvaTable onAdd={() => setShowModal(true)} />
      {showModal && <NoviPrisustvoModal onClose={() => setShowModal(false)} />}
    </div>
  );
} 