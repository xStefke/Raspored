import { useState } from "react";
import { ZoomIn } from "lucide-react";

export default function ScheduleImage({
  src,
  alt = "Распоред",
}: {
  src: string;
  alt?: string;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      {/* Normalni prikaz slike */}
      <div className="w-full h-full flex justify-center items-center overflow-hidden p-4 relative">
        <img
          src={src}
          alt={alt}
          onClick={() => setIsFullscreen(true)}
          className="w-[75%] h-full object-contain rounded-2xl shadow-xl border-4 border-gray-300 cursor-pointer p-4 bg-white"
        />

        {/* Zoom ikonica na dnu slike */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-15 bg-white/95 hover:bg-white text-gray-700 p-6 rounded-full shadow-2xl"
          title="Prikaži u punom ekranu"
        >
          <ZoomIn size={64} />
        </button>
      </div>

      {/* Fullscreen prikaz */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 bg-black/50 bg-opacity-90 flex flex-col items-center justify-center z-50"
        >
          {/* Slika zauzima prostor fleksibilno, bez sečenja */}
          <div className="flex-1 flex justify-center items-center w-full overflow-hidden">
            <img
              src={src}
              alt={alt}
              className="max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-lg"
            />
          </div>

          {/* Dugme dole */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="mb-6 text-white text-6xl font-light bg-black/70 rounded-full w-30 h-30 flex items-center justify-center backdrop-blur-sm"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
