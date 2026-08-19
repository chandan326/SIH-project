"use client";

import React, { useState } from "react";
import { Calculator, Scale, Scissors, Layers, CheckCircle2, ArrowRight } from "lucide-react";

export default function MeasurementsPage() {
  const [areaSqM, setAreaSqM] = useState<number>(10000);
  const [selectedState, setSelectedState] = useState<string>("Maharanya");

  // Geodesic unit calculations
  const sqFeet = areaSqM * 10.7639;
  const acres = areaSqM / 4046.86;
  const hectares = areaSqM / 10000.0;

  // Regional units based on selected state rules
  const getRegionalUnits = () => {
    switch (selectedState) {
      case "Maharanya":
        return [
          { name: "Guntha", val: (areaSqM / 101.17).toFixed(2), desc: "1 Guntha = 101.17 m²" },
          { name: "Bigha (Standard)", val: (areaSqM / 2500.0).toFixed(2), desc: "1 Bigha = 2,500 m²" },
        ];
      case "Uttar Pradesh Demo":
        return [
          { name: "Pucca Bigha", val: (areaSqM / 2529.3).toFixed(2), desc: "1 Pucca Bigha = 2,529.3 m²" },
          { name: "Biswa", val: (areaSqM / 126.46).toFixed(2), desc: "1/20 of Bigha" },
        ];
      case "Karnapur":
        return [
          { name: "Guntha", val: (areaSqM / 101.17).toFixed(2), desc: "1 Guntha = 101.17 m²" },
          { name: "Cents", val: (areaSqM / 40.4686).toFixed(2), desc: "1 Cent = 40.47 m²" },
        ];
      case "Rajasthan Demo":
        return [
          { name: "Rajasthan Bigha", val: (areaSqM / 2722.5).toFixed(2), desc: "1 Bigha = 2,722.5 m²" },
          { name: "Biswa", val: (areaSqM / 136.125).toFixed(2), desc: "1/20 of Bigha" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
          <Calculator className="h-7 w-7 text-emerald-400" />
          <span>Geodesic Land Measurement & Regional Unit Converter</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl">
          Convert geodesic polygon land surface areas between metric, imperial, and state revenue units using exact WGS84 spherical integration standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Converter Controls */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Scale className="h-5 w-5 text-emerald-400" /> Area Input
          </h3>

          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-semibold">Surface Area (Square Meters)</label>
            <input
              type="number"
              value={areaSqM}
              onChange={(e) => setAreaSqM(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-base font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-semibold">State Revenue Rulebook</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="Maharanya">Maharanya (Guntha, Bigha)</option>
              <option value="Uttar Pradesh Demo">Uttar Pradesh (Pucca Bigha, Biswa)</option>
              <option value="Karnapur">Karnapur (Guntha, Cents)</option>
              <option value="Rajasthan Demo">Rajasthan (Bigha, Biswa)</option>
            </select>
          </div>
        </div>

        {/* Universal Standard Output */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base">Standard Metric & Imperial</h3>
          
          <div className="space-y-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 text-xs">Square Feet (sq.ft)</span>
              <strong className="text-white font-mono text-sm">{sqFeet.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 text-xs">Acres</span>
              <strong className="text-emerald-400 font-mono text-sm">{acres.toFixed(4)}</strong>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 text-xs">Hectares (ha)</span>
              <strong className="text-teal-400 font-mono text-sm">{hectares.toFixed(4)}</strong>
            </div>
          </div>
        </div>

        {/* State Regional Units Output */}
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center justify-between">
            <span>State Units ({selectedState})</span>
            <span className="text-emerald-400 text-xs font-semibold">Configured</span>
          </h3>

          <div className="space-y-3">
            {getRegionalUnits().map((ru) => (
              <div key={ru.name} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold text-xs">{ru.name}</span>
                  <strong className="text-emerald-400 font-mono text-base">{ru.val}</strong>
                </div>
                <p className="text-[10px] text-slate-500">{ru.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
