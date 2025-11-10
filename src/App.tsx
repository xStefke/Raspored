import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ScheduleImage from "./components/ui/ScheduleImage";
import { studyPrograms } from "./data/programsData";
import ProgramSelect from "./features/program-select";
import logoAkademije from "./img/logo/akademiajlogo.png";
import logoTima from "./img/logo/apps-team-horizontal-01.png";

export default function SchedulePage() {
  const [selectedStudyType, setSelectedStudyType] = useState<
  "osnovne" | "master" | null > (null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<{
    [programId: string]: number;
  }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll sa infinity efektom
  useEffect(() => {
    if (!scrollRef.current || !autoScroll || !selectedStudyType) return;
    const container = scrollRef.current;

    const scrollInterval = setInterval(() => {
      if (!container) return;

      container.scrollLeft += 2;

      const itemWidth = 320 + 32; // clamp max width + gap
      const totalItems = container.children.length;
      const singleSetWidth =
        itemWidth * (totalItems / (programs.length <= 4 ? 3 : 2));

      if (container.scrollLeft >= singleSetWidth) {
        container.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [autoScroll, selectedStudyType]);

  const programs = selectedStudyType ? studyPrograms[selectedStudyType] : [];

  // Stop auto-scroll na interakciju i resetuj posle 1 minuta
  useEffect(() => {
    const stopAutoScroll = () => {
      console.log("Scroll zaustavljen!");
      setAutoScroll(false);

      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }

      autoScrollTimeoutRef.current = setTimeout(() => {
        console.log("Scroll ponovo pokrenut!");
        setAutoScroll(true);
      }, 10000);
    };

    const container = scrollRef.current;

    if (container) {
      container.addEventListener("touchstart", stopAutoScroll, {
        passive: true,
      });
      container.addEventListener("mousedown", stopAutoScroll);
      container.addEventListener("wheel", stopAutoScroll, { passive: true });
      container.addEventListener("click", stopAutoScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", stopAutoScroll);
        container.removeEventListener("mousedown", stopAutoScroll);
        container.removeEventListener("wheel", stopAutoScroll);
        container.removeEventListener("click", stopAutoScroll);
      }
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [selectedStudyType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "auto" });
      setAutoScroll(true);
    }
  }, [selectedStudyType]);

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
  };

  const handleYearSelect = (programId: string, year: number) => {
    setSelectedYears((prev) => {
      const newState = {
        ...prev,
        [programId]: year,
      };
      return newState;
    });
    setSelectedProgram(programId);
  };

  const handleBackClick = () => {
    setSelectedProgram(null);
    setSelectedStudyType(null);
    setSelectedYears({});
  };

  const currentImage =
    selectedProgram && selectedProgram in selectedYears
      ? `src/img/${selectedProgram}${selectedYears[selectedProgram]}.jpg`
      : null;

  const shouldDuplicate = programs.length <= 4;
  const displayPrograms = shouldDuplicate
    ? [...programs, ...programs, ...programs, ...programs]
    : [...programs, ...programs];

  return (
    <div className="relative flex flex-col h-screen bg-white text-foreground">
      <img
        src={logoAkademije}
        alt="Logo"
        className="absolute top-6 left-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none z-10"
      />
      <img
        src={logoTima}
        alt="Logo"
        className="absolute top-6 right-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none z-10"
      />
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {currentImage ? (
          <ScheduleImage src={currentImage} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-white text-gray-900 text-center px-8">
            <h1 className="text-6xl font-bold mb-6">Добродошли!</h1>
            <p className="text-3xl text-gray-700">
              Изаберите смер да бисте приказали распоред часова
            </p>
          </div>
        )}
      </div>

      <div className="relative w-full py-10 overflow-visible">
        {!selectedStudyType && (
          <div className="flex justify-center gap-12">
            <Button
              variant="outline"
              className="text-4xl px-16 py-8 rounded-2xl font-semibold shadow-md hover:scale-105 transition-all"
              onClick={() => setSelectedStudyType("osnovne")}
            >
              🎓 Основне студије
            </Button>
            <Button
              variant="outline"
              className="text-4xl px-16 py-8 rounded-2xl font-semibold shadow-md hover:scale-105 transition-all"
              onClick={() => setSelectedStudyType("master")}
            >
              🎓 Мастер студије
            </Button>
          </div>
        )}

        {selectedStudyType && (
          <div className={`${selectedStudyType ==='master' ? "max-w-2/3 mx-auto" : ""}`}>
            <Button
              variant="outline"
              className="absolute left-10 top-1/2 -translate-y-1/2 z-10 flex-none w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)] text-2xl rounded-2xl font-semibold shadow-md bg-white"
              onClick={handleBackClick}
            >
              ⬅️ Назад
            </Button>

            <div
              ref={scrollRef}
              className={`flex gap-8 overflow-x-auto px-4 py-4 scrollbar-hide items-center ml-[calc(10px+clamp(260px,15vw,320px)+2rem)]`}
            >
              {displayPrograms.map((program, index) => (
                <ProgramSelect
                  key={`${program.id}-${index}`}
                  program={program}
                  selectedProgram={selectedProgram}
                  selectedYear={selectedYears[program.id] ?? null}
                  onProgramSelect={handleProgramSelect}
                  onYearSelect={handleYearSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
