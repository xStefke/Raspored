import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface ProgramSelectProps {
  program: any;
  selectedProgram: string | null;
  selectedYear: number | null;
  onProgramSelect: (programId: string) => void;
  onYearSelect: (programId: string, year: number) => void;
}

export default function ProgramSelect({
  program,
  selectedProgram,
  selectedYear,
  onProgramSelect,
  onYearSelect,
}: ProgramSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onProgramSelect(program.id);
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex-none">
      <Button
        ref={triggerRef}
        variant={selectedProgram === program.id ? "default" : "outline"}
        className={`flex flex-col justify-center items-center w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)]
          text-2xl rounded-2xl transition-all duration-200 overflow-visible whitespace-normal break-words text-center leading-tight px-4 py-3
          ${
            selectedProgram === program.id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-card hover:bg-accent text-card-foreground"
          }`}
        onClick={handleToggle}
      >
        <div className="text-center break-words leading-tight">
          <div className="text-3xl font-bold mb-1">{program.short}</div>
          <div className="text-lg">{program.name}</div>
        </div>
      </Button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute z-50 w-[clamp(260px,15vw,320px)] bg-white rounded-lg shadow-lg -translate-y-full"
            style={{
              left: triggerRef.current?.getBoundingClientRect().left,
              top: triggerRef.current?.getBoundingClientRect().top,
            }}
          >
            <div className="p-2">
              {/* <div className="text-lg font-semibold mb-2 text-gray-900">
                Године
              </div> */}
              {program.years.map((year: number) => (
                <div
                  key={year}
                  className={`p-3 text-center cursor-pointer rounded-md hover:bg-gray-100 transition-all ${
                    selectedYear === year
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-900"
                  }`}
                  onClick={() => {
                    onYearSelect(program.id, year);
                    setOpen(false);
                  }}
                >
                  {year}. година
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
