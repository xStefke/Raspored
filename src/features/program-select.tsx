import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";

interface ProgramSelectProps {
  program: any;
  selectedProgram: string | null;
  displayedProgramYear: { program: string; year: number } | null;
  onProgramSelect: (programId: string) => void;
  onYearSelect: (programId: string, year: number) => void;
  isScrolling: boolean;
}

export default function ProgramSelect({
  program,
  displayedProgramYear,
  onProgramSelect,
  onYearSelect,
  isScrolling,
}: ProgramSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });

  const handleToggle = () => {
    onProgramSelect(program.id);
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isScrolling && open) {
      setOpen(false);
    }
  }, [isScrolling, open]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          left: rect.left,
          top: rect.top,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

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

  // Highlighted je samo ako je slika trenutno prikazana za ovaj program
  const isActive = displayedProgramYear?.program === program.id;
  const displayedYear = isActive ? displayedProgramYear?.year : null;

  return (
    <div className="relative flex-none">
      <Button
        ref={triggerRef}
        variant={isActive ? "default" : "outline"}
        className={`flex flex-col justify-center items-center w-[clamp(260px,15vw,320px)] h-[clamp(160px,9vw,220px)]
          text-2xl rounded-2xl transition-all duration-200 overflow-visible whitespace-normal break-words text-center leading-tight px-4 py-3
          ${
            isActive
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
            className="fixed z-50 w-[clamp(260px,15vw,320px)] bg-white rounded-lg shadow-lg -translate-y-full"
            style={{
              left: dropdownPosition.left,
              top: dropdownPosition.top,
            }}
          >
            <div className="p-2">
              {program.years.map((year: number) => (
                <div
                  key={year}
                  className={`p-3 py-20 text-center cursor-pointer rounded-md hover:bg-gray-100 transition-all text-4xl font-bold ${
                    displayedYear === year
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
