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
  const [displayedImage, setDisplayedImage] = useState<string | null>(null);
  const [displayedProgramYear, setDisplayedProgramYear] = useState<{
    program: string;
    year: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const programs = selectedStudyType ? studyPrograms[selectedStudyType] : [];

  // Auto-scroll sa infinity efektom
  useEffect(() => {
    if (!scrollRef.current || !autoScroll || !selectedStudyType) return;
    const container = scrollRef.current;

    const scrollInterval = setInterval(() => {
      if (!container) return;

      container.scrollLeft += 2;

      const itemWidth = 320 + 32;
      const singleSetWidth = itemWidth * programs.length;

      if (container.scrollLeft >= singleSetWidth) {
        container.scrollLeft = 1;
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, [autoScroll, selectedStudyType, programs.length]);

  // Stop auto-scroll na interakciju i resetuj posle 1 minuta
  useEffect(() => {
    const stopAutoScroll = () => {
      setAutoScroll(false);

      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }

      autoScrollTimeoutRef.current = setTimeout(() => {
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
    setSelectedProgram(programId);
    setDisplayedProgramYear({ program: programId, year: year });
    const newImage = `src/img/${programId}${year}.jpg`;
    setDisplayedImage(newImage);
  };

  const handleBackClick = () => {
    setSelectedProgram(null);
    setSelectedStudyType(null);
    setDisplayedImage(null);
    setDisplayedProgramYear(null);
  };

  const displayPrograms =
    programs.length <= 5 ? programs : [...programs, ...programs];

  return (
    <div className="relative flex flex-col h-screen bg-white text-foreground">
      <img
        src={logoAkademije}
        alt="Logo"
        className="fixed top-6 left-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none z-10"
      />
      <img
        src={logoTima}
        alt="Logo"
        className="fixed top-6 right-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none z-10"
      />
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {displayedImage ? (
          <ScheduleImage src={displayedImage} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-white text-gray-900 text-center px-8">
            <h1 className="text-6xl font-bold mb-6">Добродошли!</h1>
            <p className="text-3xl text-gray-700">
              Изаберите смер да бисте приказали распоред часова
            </p>
          </div>
        )}
      </div>

      <div className="relative w-full py-10 overflow-visible shadow-xl border-4 border-gray-300 cursor-pointer">
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
          <div
            className={`flex items-center gap-8 ${
              programs.length <= 5 ? "justify-center px-10" : "px-10"
            }`}
          >
            <Button
              variant="outline"
              className="flex-none w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)] text-2xl rounded-2xl font-semibold shadow-md bg-white"
              onClick={handleBackClick}
            >
              ⬅️ Назад
            </Button>

            <div
              ref={scrollRef}
              className={`flex gap-8 items-center  ${
                programs.length <= 5
                  ? "overflow-visible"
                  : "overflow-x-auto scrollbar-hide flex-1"
              }`}
            >
              {displayPrograms.map((program, index) => (
                <ProgramSelect
                  key={`${program.id}-${index}`}
                  program={program}
                  selectedProgram={selectedProgram}
                  displayedProgramYear={displayedProgramYear}
                  onProgramSelect={handleProgramSelect}
                  onYearSelect={handleYearSelect}
                  isScrolling={autoScroll}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
