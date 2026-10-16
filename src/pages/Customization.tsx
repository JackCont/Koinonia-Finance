import { useState } from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import { getTheme, saveTheme, resetTheme, themePresets } from '../store';
import { AppTheme } from '../types';

export default function Customization() {
  const [theme, setTheme] = useState<AppTheme>(getTheme());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Recarregar a página para aplicar as mudanças
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleReset = () => {
    if (confirm('Restaurar tema padrão?')) {
      resetTheme();
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const applyPreset = (presetName: string) => {
    const preset = themePresets[presetName];
    if (preset) {
      setTheme(preset);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Palette size={28} />
          Personalização do App
        </h1>
        <p className="text-indigo-200 mt-1">Customize as cores e o visual do sistema</p>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Temas Predefinidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(themePresets).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => applyPreset(name)}
              className="p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-400 transition-all hover:shadow-md"
            >
              <div
                className="w-full h-16 rounded-lg mb-2"
                style={{
                  background: `linear-gradient(135deg, ${preset.sidebarGradientFrom}, ${preset.sidebarGradientVia}, ${preset.sidebarGradientTo})`
                }}
              />
              <p className="text-xs font-medium text-slate-700 capitalize">{name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Cores Personalizadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor Primária</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Usada em botões e elementos principais</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor Secundária</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={e => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Usada em elementos secundários</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor de Destaque</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.accentColor}
                onChange={e => setTheme({ ...theme, accentColor: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={theme.accentColor}
                  onChange={e => setTheme({ ...theme, accentColor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Usada em destaques e alertas</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor do Botão Primário</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.buttonPrimary}
                onChange={e => setTheme({ ...theme, buttonPrimary: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={theme.buttonPrimary}
                  onChange={e => setTheme({ ...theme, buttonPrimary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                />
                <p className="text-xs text-slate-500 mt-1">Cor dos botões principais</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Gradient */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Gradiente da Barra Lateral</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor Inicial</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.sidebarGradientFrom}
                onChange={e => setTheme({ ...theme, sidebarGradientFrom: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={theme.sidebarGradientFrom}
                onChange={e => setTheme({ ...theme, sidebarGradientFrom: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor Central</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.sidebarGradientVia}
                onChange={e => setTheme({ ...theme, sidebarGradientVia: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={theme.sidebarGradientVia}
                onChange={e => setTheme({ ...theme, sidebarGradientVia: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Cor Final</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.sidebarGradientTo}
                onChange={e => setTheme({ ...theme, sidebarGradientTo: e.target.value })}
                className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={theme.sidebarGradientTo}
                onChange={e => setTheme({ ...theme, sidebarGradientTo: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Preview do Gradiente:</p>
          <div
            className="h-20 rounded-xl"
            style={{
              background: `linear-gradient(to bottom, ${theme.sidebarGradientFrom}, ${theme.sidebarGradientVia}, ${theme.sidebarGradientTo})`
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white shadow-sm transition-colors"
          style={{ backgroundColor: theme.buttonPrimary }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.buttonPrimaryHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = theme.buttonPrimary)}
        >
          <Check size={16} /> Salvar e Aplicar
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-300 transition-colors"
        >
          <RotateCcw size={16} /> Restaurar Padrão
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium animate-pulse">
            ✓ Tema salvo! Recarregando...
          </span>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Dica:</strong> Após salvar as alterações, a página será recarregada automaticamente para aplicar o novo tema. 
          Você pode personalizar cada cor individualmente ou usar um dos temas predefinidos como ponto de partida.
        </p>
      </div>
    </div>
  );
}
