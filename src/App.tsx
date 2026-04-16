/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Shield, 
  Activity, 
  Volume2, 
  VolumeX, 
  Clock, 
  Eye, 
  ChevronRight,
  AlertTriangle,
  Terminal,
  Info,
  Copy,
  Check,
  Share2,
  Gamepad2,
  ExternalLink,
  Monitor
} from 'lucide-react';
import { BETTING_HOUSES, ALERT_SOUND_URL } from './constants';
import { AviatorResult, BettingHouse, SequenceType } from './types';

export default function App() {
  const [selectedHouse, setSelectedHouse] = useState<BettingHouse>(BETTING_HOUSES[0]);
  const [results, setResults] = useState<AviatorResult[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [lastAlert, setLastAlert] = useState<{ type: SequenceType; time: string } | null>(null);
  const [alertHistory, setAlertHistory] = useState<{ type: SequenceType; time: string; house: string }[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(false);
  const [systemLogs, setSystemLogs] = useState<string[]>(['Sistema Venom Hacker v3.0 inicializado...', 'Aguardando comando de injeção...']);
  const [nextPrediction, setNextPrediction] = useState<{ minute: number; second: number; type: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'hacker' | 'play' | 'operation'>('hacker');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Add system log
  const addLog = useCallback((msg: string) => {
    setSystemLogs(prev => [msg, ...prev].slice(0, 6));
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(ALERT_SOUND_URL);
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Play alert sound
  const playAlert = useCallback(() => {
    if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [isMuted]);

  // Generate a new prediction for "Double Purple"
  const generatePrediction = useCallback(() => {
    const now = new Date();
    const future = new Date(now.getTime() + (Math.floor(Math.random() * 2) + 1) * 60000);
    const seconds = Math.floor(Math.random() * 60);
    
    setNextPrediction({
      minute: future.getMinutes(),
      second: seconds,
      type: 'ROXO DUPLO'
    });
    addLog(`Nova janela de vulnerabilidade detectada: ${future.getMinutes().toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [addLog]);

  // Handle Start/Stop
  const toggleScanning = () => {
    if (!isScanning) {
      addLog(`Iniciando injeção em ${selectedHouse.name}...`);
      addLog('Conectando aos nodes de Moçambique...');
      setTimeout(() => {
        setIsScanning(true);
        generatePrediction();
        addLog('Injeção estabelecida com sucesso.');
      }, 1500);
    } else {
      setIsScanning(false);
      addLog('Injeção interrompida pelo usuário.');
    }
  };

  const copySignal = () => {
    if (!nextPrediction) return;
    
    const text = `🚀 VENOM HACKER - SINAL CONFIRMADO\n\n🏠 Casa: ${selectedHouse.name}\n⏰ Horário: ${nextPrediction.minute.toString().padStart(2, '0')}:${nextPrediction.second.toString().padStart(2, '0')}\n🎯 Alvo: ${nextPrediction.type}\n✅ Confiança: 99.9%\n\n⚠️ Entre no minuto exato!`;
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      addLog('Sinal copiado para a área de transferência.');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Update alert history when a new alert occurs
  useEffect(() => {
    if (lastAlert) {
      setAlertHistory(prev => [{ ...lastAlert, house: selectedHouse.name }, ...prev].slice(0, 5));
    }
  }, [lastAlert, selectedHouse.name]);

  // Check if prediction time has passed and refresh if needed
  useEffect(() => {
    if (!isScanning || !nextPrediction) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const predTime = new Date();
      predTime.setMinutes(nextPrediction.minute);
      predTime.setSeconds(nextPrediction.second);

      // If current time is more than 10 seconds past prediction, generate new one
      if (now.getTime() > predTime.getTime() + 10000) {
        addLog('Janela expirada. Recalibrando algoritmo...');
        generatePrediction();
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  }, [isScanning, nextPrediction, generatePrediction, addLog]);

  // Simulate new Aviator results
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      const newMultiplier = Number((Math.random() * 10 + 1).toFixed(2));
      const now = new Date();
      
      const newResult: AviatorResult = {
        id: Math.random().toString(36).substr(2, 9),
        multiplier: newMultiplier,
        timestamp: now,
      };

      setResults(prev => {
        const updated = [newResult, ...prev].slice(0, 20);
        
        if (nextPrediction) {
          const isMatch = now.getMinutes() === nextPrediction.minute && 
                          Math.abs(now.getSeconds() - nextPrediction.second) < 5;
          
          if (isMatch) {
            addLog('ALVO ATINGIDO! INJETANDO ROXO DUPLO...');
            setLastAlert({ type: '2x', time: now.toLocaleTimeString() });
            playAlert();
            setTimeout(generatePrediction, 10000);
          }
        }
        
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning, playAlert, nextPrediction, generatePrediction, addLog]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono selection:bg-white/30 overflow-x-hidden">
      {/* Matrix-like background effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              <Zap className="text-black fill-black" size={24} />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white font-display italic uppercase">VENOM HACKER</h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <p className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Injetor de Roxos v3.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <nav className="hidden md:flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
              <button 
                onClick={() => setActiveTab('hacker')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'hacker' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Terminal size={14} /> Hacker
              </button>
              <button 
                onClick={() => setActiveTab('play')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'play' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Gamepad2 size={14} /> Jogar
              </button>
              <button 
                onClick={() => setActiveTab('operation')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'operation' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
              >
                <Monitor size={14} /> Sala de Operação
              </button>
            </nav>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Tempo Real</span>
              <div className="flex items-center gap-2 text-white">
                <Clock size={14} />
                <span className="text-sm font-bold">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-zinc-800 hidden sm:block" />
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl transition-all border ${
                isMuted ? 'text-zinc-500 border-zinc-800' : 'text-white border-white/10 bg-white/5'
              }`}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
              <Shield size={12} /> Nodes de Moçambique
            </h2>
            <div className="space-y-2">
              {BETTING_HOUSES.map((house) => (
                <button
                  key={house.id}
                  onClick={() => setSelectedHouse(house)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all border group ${
                    selectedHouse.id === house.id 
                      ? 'bg-white/10 border-white/50 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                      : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xl transition-transform group-hover:scale-110 ${selectedHouse.id === house.id ? 'scale-110' : ''}`}>{house.logo}</span>
                    <span className="text-xs font-bold tracking-tight uppercase">{house.name}</span>
                  </div>
                  {selectedHouse.id === house.id && (
                    <motion.div layoutId="active-house">
                      <ChevronRight size={16} className="text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
              <Terminal size={12} /> Console de Injeção
            </h2>
            <div className="space-y-2 font-mono">
              {systemLogs.map((log, i) => (
                <div key={i} className={`text-[9px] leading-tight ${i === 0 ? 'text-white' : 'text-zinc-600'}`}>
                  <span className="text-zinc-700 mr-2">[{currentTime.toLocaleTimeString([], { hour12: false })}]</span>
                  {log}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-500 uppercase font-bold">Status</span>
                <span className={`text-[9px] font-bold ${isScanning ? 'text-white' : 'text-zinc-600'}`}>
                  {isScanning ? 'EXECUTANDO' : 'STANDBY'}
                </span>
              </div>
              <button
                onClick={toggleScanning}
                className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                  isScanning 
                    ? 'bg-transparent border-white/20 text-white hover:bg-white/5' 
                    : 'bg-white text-black border-white hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                }`}
              >
                {isScanning ? 'Parar Injeção' : 'Iniciar Bot'}
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          {activeTab === 'hacker' ? (
            <>
              <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Sincronizado</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2 uppercase tracking-[0.3em]">
                    <Eye size={16} /> Próximo Sinal Confirmado
                  </h2>
                  <p className="text-zinc-500 text-xs mb-10 uppercase tracking-tight">Algoritmo de Injeção de Roxos Duplos</p>
                  
                  <div className="flex items-center gap-8 mb-12">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase mb-3 tracking-widest">Minuto</span>
                      <div className="w-24 h-28 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                        <span className="text-6xl font-black text-white font-display">
                          {nextPrediction?.minute.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                    <span className="text-5xl font-black text-white/20 pt-8">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-zinc-600 font-bold uppercase mb-3 tracking-widest">Segundo</span>
                      <div className="w-24 h-28 bg-black/80 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                        <span className="text-6xl font-black text-white font-display">
                          {nextPrediction?.second.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <div className={`px-8 py-3 font-black text-sm rounded-xl uppercase tracking-[0.2em] transition-all ${
                      isScanning 
                        ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                        : 'bg-zinc-800 text-zinc-500 border border-white/5'
                    }`}>
                      {isScanning ? nextPrediction?.type : 'BOT DESATIVADO'}
                    </div>
                    
                    {isScanning && (
                      <button
                        onClick={copySignal}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                      >
                        {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        {isCopied ? 'Copiado!' : 'Copiar Sinal'}
                      </button>
                    )}

                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      Confiança do Sistema: <span className="text-white">99.9%</span>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {lastAlert && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="p-8 rounded-3xl border-2 bg-white/5 border-white/20 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 animate-pulse" />
                    <div className="flex items-center gap-6 relative z-10">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg"
                      >
                        <AlertTriangle size={32} />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-1">
                          ROXO DUPLO CONFIRMADO!
                        </h3>
                        <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                          Entrada Executada com Sucesso às {lastAlert.time}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={generatePrediction}
                      className="relative z-10 px-6 py-3 bg-white text-black font-black text-xs rounded-xl uppercase tracking-widest hover:bg-zinc-200 transition-all"
                    >
                      Próximo Sinal
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : activeTab === 'play' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BETTING_HOUSES.map((house) => (
                <a
                  key={house.id}
                  href={house.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900/60 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-white/30 transition-all hover:bg-zinc-800/80"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{house.logo}</span>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">{house.name}</h3>
                      <p className="text-[9px] text-zinc-500 uppercase font-bold">Abrir Casa de Aposta</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ExternalLink size={18} />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[700px]">
              <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{selectedHouse.logo}</span>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">{selectedHouse.name}</h3>
                    <p className="text-[8px] text-zinc-500 uppercase font-bold">Sala de Operação Ativa</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Injeção Estabilizada</span>
                  </div>
                  <a 
                    href={selectedHouse.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div className="flex-1 bg-zinc-950 relative">
                <iframe 
                  src={selectedHouse.url} 
                  className="w-full h-full border-none"
                  title={`Operação em ${selectedHouse.name}`}
                />
                {/* Overlay for "Hacker" feel */}
                <div className="absolute inset-0 pointer-events-none border-4 border-white/5" />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Info size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Instruções de Injeção</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed max-w-xl">
                O bot Venom Hacker v3.0 identifica janelas de vulnerabilidade onde a casa é forçada a entregar multiplicadores roxos (2.0x+). 
                Aguarde o minuto e segundo exatos para realizar sua aposta. Recomendamos proteção no 1.5x e alvo no 2.0x.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xl font-black text-white">99%</p>
              <p className="text-[8px] text-zinc-600 uppercase font-bold">Assertividade</p>
            </div>
            <div className="w-[1px] bg-zinc-800" />
            <div className="text-center">
              <p className="text-xl font-black text-white">24/7</p>
              <p className="text-[8px] text-zinc-600 uppercase font-bold">Monitoramento</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
