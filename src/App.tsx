import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ScheduleImage from "./components/ui/ScheduleImage";
import { studyPrograms } from "./data/programsData";
import ProgramSelect from "./features/program-select";
import logoAkademije from "./img/logo/akademiajlogo.png"
import logoTima from "./img/logo/apps-team-horizontal-01.png"

export default function SchedulePage() {
  const [selectedStudyType, setSelectedStudyType] = useState<
    "osnovne" | "master" | null
  >(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<{
    [programId: string]: number;
  }>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
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
     
  return (
    <div className="relative flex flex-col h-screen bg-white text-foreground">
      <img
        src={logoAkademije}
        alt="Logo"
        className="absolute top-6 left-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none"
      />
      <img
        src={logoTima}
        alt="Logo"
        className="absolute top-6 right-10 w-[clamp(250px,8vw,160px)] h-auto opacity-90 select-none pointer-events-none"
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

      <div className="w-[85vw] mx-auto py-10 overflow-visible">
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
            ref={scrollRef}
            className={`flex gap-8 overflow-x-auto px-4 py-4 scrollbar-hide snap-x snap-mandatory scroll-smooth items-center ${
              selectedStudyType === "master"
                ? "justify-center"
                : "justify-start"
            }`}
          >
            <Button
              variant="outline"
              className="flex-none w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)] text-2xl rounded-2xl font-semibold shadow-md"
              onClick={handleBackClick}
            >
              ⬅️ Назад
            </Button>

            {studyPrograms[selectedStudyType].map((program) => (
              <ProgramSelect
                key={program.id}
                program={program}
                selectedProgram={selectedProgram}
                selectedYear={selectedYears[program.id] ?? null}
                onProgramSelect={handleProgramSelect}
                onYearSelect={handleYearSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
