import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OverlayCardProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  recipeId: string | undefined;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function OverlayCard({ open, onClose, children,recipeId }: OverlayCardProps) {
  const [address,setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [saved, setSaved] =useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const location = { address, zip, state };
    localStorage.setItem("userLocation", JSON.stringify(location));
    setSaved(true);
    await delay(750);
    navigate(`/package/${recipeId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm"
      style={{ backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative min-w-[300px] max-w-[90vw]"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">Enter Your Location</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={zip}
            onChange={e => setZip(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={e => setState(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
          <Button
            className="rounded-md px-4 py-4 justify-self-end mt-4 hover:scale-105" 
            variant="outline"
            >
            Save Location
          </Button>
        </form>
        {saved && (
          <div className="text-green-600 font-semibold mb-2">
            Location saved!
          </div>
        )}
        {children}
      </div>
    </div>
  );
}