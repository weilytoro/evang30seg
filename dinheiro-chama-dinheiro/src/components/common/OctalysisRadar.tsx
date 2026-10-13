import React from 'react';
import { OctalysisMetrics } from '../../hooks/useOctalysisScore';

interface OctalysisRadarProps {
  metrics: OctalysisMetrics;
}

export const OctalysisRadar: React.FC<OctalysisRadarProps> = ({ metrics }) => {
  const drives = [
    { label: '🦅 Epic Meaning', value: metrics.epicMeaning, color: 'from-purple-400 to-purple-600' },
    { label: '🏆 Achievement', value: metrics.achievement, color: 'from-amber-400 to-amber-600' },
    { label: '💡 Empowerment', value: metrics.empowerment, color: 'from-emerald-400 to-emerald-600' },
    { label: '👑 Ownership', value: metrics.ownership, color: 'from-cyan-400 to-cyan-600' },
    { label: '👥 Social', value: metrics.social, color: 'from-pink-400 to-pink-600' },
    { label: '⏰ Scarcity', value: metrics.scarcity, color: 'from-red-400 to-red-600' },
    { label: '🎲 Unpredictability', value: metrics.unpredictability, color: 'from-yellow-400 to-yellow-600' },
    { label: '🛡️ Loss Avoidance', value: metrics.loss, color: 'from-slate-400 to-slate-600' },
  ];

  // Radar chart usando SVG
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const levels = 5; // 0, 200, 400, 600, 800, 1000

  const getPoint = (index: number, value: number) => {
    const angle = (index / drives.length) * Math.PI * 2 - Math.PI / 2;
    const r = (value / 1000) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getGridPoint = (index: number, level: number) => {
    const angle = (index / drives.length) * Math.PI * 2 - Math.PI / 2;
    const r = (level / 1000) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = drives
    .map((_, i) => getPoint(i, drives[i].value))
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎮</span>
          <h3 className="font-black text-slate-900">Seu Perfil Octalysis</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase font-bold">Drive Score</p>
          <p className="text-3xl font-black text-slate-900">{metrics.totalScore}/1000</p>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
          {/* Grid circles */}
          {Array.from({ length: levels + 1 }).map((_, level) => {
            const r = ((level / levels) * 1000) / 1000 * radius;
            return (
              <circle
                key={`grid-${level}`}
                cx={center}
                cy={center}
                r={r}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}

          {/* Grid lines */}
          {drives.map((_, i) => {
            const p = getGridPoint(i, 1000);
            return (
              <line
                key={`line-${i}`}
                x1={center}
                y1={center}
                x2={p.x}
                y2={p.y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}

          {/* Data polygon */}
          <polygon points={polygonPoints} fill="url(#radarGradient)" fillOpacity="0.4" stroke="#6366f1" strokeWidth="2" />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Data points */}
          {drives.map((drive, i) => {
            const p = getPoint(i, drive.value);
            return (
              <circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r="6"
                fill={drive.color.startsWith('from-purple') ? '#a855f7' : '#6366f1'}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Labels */}
          {drives.map((drive, i) => {
            const p = getGridPoint(i, 1200);
            return (
              <text
                key={`label-${i}`}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold fill-slate-700"
                fontSize="12"
              >
                {drive.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {drives.map((drive, i) => (
          <div key={i} className={`p-3 rounded-2xl bg-gradient-to-br ${drive.color} shadow-lg`}>
            <p className="text-white text-xs font-bold mb-2">{drive.label}</p>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${(drive.value / 1000) * 100}%` }}
              />
            </div>
            <p className="text-white font-black text-sm mt-1">{drive.value}</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <p className="text-xs font-bold text-emerald-900 uppercase mb-2">💪 Seu Drive Dominante</p>
          <p className="text-sm font-black text-emerald-800">{metrics.dominantDrive}</p>
          <p className="text-xs text-emerald-700 mt-1">
            Isso é sua maior força - use para impulsionar progresso financeiro!
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <p className="text-xs font-bold text-blue-900 uppercase mb-2">⚖️ Índice de Balanço</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${metrics.balanceIndex}%` }}
              />
            </div>
            <p className="text-sm font-black text-blue-800 whitespace-nowrap">{metrics.balanceIndex}%</p>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            {metrics.balanceIndex > 70
              ? '🎯 Ótimo balanço entre todos os drives!'
              : metrics.balanceIndex > 40
                ? '📈 Desenvolva seus drives fracos'
                : '⚠️ Foque em diversificar sua motivação'}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
          <p className="text-xs font-bold text-amber-900 uppercase mb-2">🎯 Próximas Ações</p>
          <ul className="text-xs text-amber-800 space-y-1">
            <li>
              • Maximize seu drive dominante completando mais{' '}
              {metrics.dominantDrive.includes('Epic') ? 'módulos' : 'ações reais'}
            </li>
            <li>• Desenvolva drives mais fracos para ganhar resiliência</li>
            <li>• Cada ação real desbloqueia novos badges!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
