import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ScheduleImage from "./components/ui/ScheduleImage";
import { studyPrograms } from "./data/programsData";
import logoAkademije from "./img/logo/akademiajlogo.png"; 
import logoTima from "./img/logo/apps-team-horizontal-01.png";  

export default function SchedulePage() {
  const [selectedStudyType, setSelectedStudyType] = useState<
    "osnovne" | "master" | null
  >(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
  }, [selectedStudyType]);

  function handleProgramClick(programId: string) {
    const program = studyPrograms[selectedStudyType!].find(
      (p) => p.id === programId
    );
    if (program) {
      setSelectedProgram(programId);
      setSelectedYear(program.years[0]);
    }
  }

  function handleBackClick() {
    setSelectedProgram(null);
    setSelectedStudyType(null);
    setSelectedYear(null);
  }

  const currentProgram =
    selectedProgram && selectedStudyType
      ? studyPrograms[selectedStudyType].find((p) => p.id === selectedProgram)
      : null;

  const currentImage =
    selectedProgram && selectedYear
      ? `src/img/${selectedProgram}${selectedYear}.jpg`
      : null;

  return (
    <div className="relative flex flex-col h-screen bg-blue-500 text-foreground">
      {/* 🟢 LOGO levo i desno */}
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

      {/* Glavni prikaz slike ili default */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        {currentImage ? (
          <ScheduleImage src={currentImage} />
        ) : (
          // Default ekran dok ništa nije izabrano
          <div className="flex flex-col items-center justify-center w-full h-full bg-white text-gray-900 text-center px-8">
            <h1 className="text-6xl font-bold mb-6">Добродошли!</h1>
            <p className="text-3xl text-gray-700">
              Изаберите смер да бисте приказали распоред часова
            </p>
          </div>
        )}
      </div>

      {/* Donji deo — selekcija */}
      <div className="w-[85vw] mx-auto py-10 overflow-hidden">
        {/* Početni izbor: Osnovне / Мастер */}
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

        {/* Smerovi */}
        {selectedStudyType && (
          <>
            <div
              ref={scrollRef}
              className={`flex gap-8 overflow-x-auto px-4 py-4 scrollbar-hide snap-x snap-mandatory scroll-smooth items-center ${selectedStudyType==="master" ? 'justify-center' : 'justify-start'}`}
            >
              {/* Dugme za nazad */}
              <Button
                variant="outline"
                className="flex-none w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)] 
                           text-2xl rounded-2xl font-semibold shadow-md"
                onClick={handleBackClick}
              >
                ⬅️ Назад
              </Button>

              {/* Dugmad za smerove */}
              {studyPrograms[selectedStudyType].map((program) => (
                <Button
                  key={program.id}
                  variant={
                    selectedProgram === program.id ? "default" : "outline"
                  }
                  className={`flex flex-col justify-center items-center flex-none
                    w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)] 
                    text-2xl rounded-2xl transition-all duration-200 overflow-visible 
                    whitespace-normal break-words text-center leading-tight px-4 py-3
                    ${
                      selectedProgram === program.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card hover:bg-accent text-card-foreground"
                    }`}
                  onClick={() => handleProgramClick(program.id)}
                >
                  <div className="text-center break-words leading-tight">
                    <div className="text-3xl font-bold mb-1">
                      {program.short}
                    </div>
                    <div className="text-lg">{program.name}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Dugmad za године */}
            {currentProgram && (
              <div className="flex justify-center gap-8 mt-8">
                {currentProgram.years.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    className="rounded-full w-24 h-24 text-3xl font-bold transition-all hover:scale-105"
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
