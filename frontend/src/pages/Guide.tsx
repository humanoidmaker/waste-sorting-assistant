import { useState, useEffect } from 'react';
import { BookOpen, Info, Leaf, Lightbulb } from 'lucide-react';
import { getGuide } from '../services/api';

export default function Guide() {
  const [guide, setGuide] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getGuide()
      .then((res) => setGuide(res.data.guide))
      .finally(() => setLoading(false));
  }, []);

  const binColorStyles: Record<string, { bg: string; dot: string }> = {
    Blue: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
    Green: { bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
    Red: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    Black: { bg: 'bg-gray-50 border-gray-200', dot: 'bg-gray-800' },
    Yellow: { bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="w-7 h-7 text-primary-800" />
        <h1 className="text-2xl font-bold text-gray-900">Waste Sorting Guide</h1>
      </div>

      <p className="text-gray-600">Complete guide for sorting waste into the correct bins. Click on any category for detailed information.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guide.map((item) => {
          const styles = binColorStyles[item.bin_color] || binColorStyles.Black;
          const isExpanded = expanded === item.waste_type;

          return (
            <div key={item.waste_type}
              className={`rounded-xl border p-5 cursor-pointer transition-all ${styles.bg} ${isExpanded ? 'col-span-1 md:col-span-2' : ''}`}
              onClick={() => setExpanded(isExpanded ? null : item.waste_type)}>

              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full ${styles.dot}`} />
                <h3 className="font-semibold text-lg flex-1">{item.waste_type}</h3>
                <span className="text-sm font-medium px-3 py-1 bg-white/80 rounded-full">{item.bin_color} Bin</span>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 opacity-70 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Disposal Instructions</p>
                        <p className="text-sm mt-1 opacity-80">{item.disposal_instructions}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Leaf className="w-4 h-4 mt-0.5 opacity-70 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Environmental Impact</p>
                        <p className="text-sm mt-1 opacity-80">{item.environmental_impact}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/60 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 opacity-70 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Tips</p>
                        <ul className="mt-1 space-y-1">
                          {item.tips.map((tip: string, i: number) => (
                            <li key={i} className="text-sm opacity-80 flex items-start gap-1">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-current rounded-full flex-shrink-0 opacity-50" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {item.co2_saved_per_item > 0 && (
                    <p className="text-sm font-medium text-green-700 text-center">
                      Each item properly sorted saves ~{item.co2_saved_per_item} kg CO2
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
