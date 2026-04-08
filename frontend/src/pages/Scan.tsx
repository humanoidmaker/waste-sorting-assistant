import { useState, useRef } from 'react';
import { Upload, ScanLine, Recycle, Leaf, Info, Lightbulb } from 'lucide-react';
import { classifyWaste } from '../services/api';
import toast from 'react-hot-toast';

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await classifyWaste(formData);
      setResult(res.data);
      toast.success(`Identified: ${res.data.waste_type}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Classification failed');
    } finally {
      setLoading(false);
    }
  };

  const binColorMap: Record<string, { bg: string; text: string; border: string }> = {
    Blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    Green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    Red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    Black: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    Yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Scan Waste</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="card">
          <h2 className="font-semibold mb-4">Upload Waste Photo</h2>
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-accent-500 hover:bg-accent-50/50 transition-colors">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <p className="text-gray-600">Drag & drop or click to upload</p>
                <p className="text-sm text-gray-400">Take a clear photo of the waste item</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

          <button onClick={analyze} disabled={!file || loading} className="btn-accent w-full mt-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> Classifying...</> : <><ScanLine className="w-5 h-5" /> Identify Waste</>}
          </button>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="font-semibold mb-4">Results</h2>
          {!result ? (
            <div className="text-center py-16 text-gray-400">
              <Recycle className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Upload a photo to identify waste type</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Waste Type & Bin */}
              <div className={`p-4 rounded-xl border ${binColorMap[result.bin_color]?.bg || 'bg-gray-100'} ${binColorMap[result.bin_color]?.border || 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-lg font-bold ${binColorMap[result.bin_color]?.text || 'text-gray-700'}`}>{result.waste_type}</p>
                    <p className="text-sm opacity-75">Confidence: {result.confidence}%</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      result.bin_color === 'Blue' ? 'bg-blue-500' :
                      result.bin_color === 'Green' ? 'bg-green-500' :
                      result.bin_color === 'Red' ? 'bg-red-500' :
                      result.bin_color === 'Yellow' ? 'bg-yellow-500' :
                      'bg-gray-800'
                    }`}>
                      {result.bin_color === 'Blue' ? 'B' : result.bin_color === 'Green' ? 'G' : result.bin_color === 'Red' ? 'R' : result.bin_color === 'Yellow' ? 'Y' : 'BK'}
                    </div>
                    <p className="text-xs mt-1 font-medium">{result.bin_color} Bin</p>
                  </div>
                </div>
              </div>

              {/* Disposal Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Disposal Instructions</p>
                    <p className="text-sm text-blue-700 mt-1">{result.disposal_instructions}</p>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <Leaf className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800">Environmental Impact</p>
                    <p className="text-sm text-green-700 mt-1">{result.environmental_impact}</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-amber-800">Tips</p>
                      <ul className="mt-1 space-y-1">
                        {result.tips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm text-amber-700 flex items-start gap-1">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {result.co2_saved > 0 && (
                <p className="text-center text-sm text-green-600 font-medium">
                  +{result.co2_saved} kg CO2 saved by proper disposal
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
