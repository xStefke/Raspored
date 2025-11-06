import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ScheduleImage from './components/ui/ScheduleImage';
// interface ScheduleItem {
//   id: string;
//   subject: string;
//   professor: string;
//   room: string;
//   type: 'предавање' | 'вежбе' | 'лаб';
//   group?: string;
// }

// interface TimeSlot {
//   time: string;
//   monday?: ScheduleItem;
//   tuesday?: ScheduleItem;
//   wednesday?: ScheduleItem;
//   thursday?: ScheduleItem;
//   friday?: ScheduleItem;
// }

const programs = [
        { id: 'ini', name: 'Индустријско инжењерство', short: 'ИНИ'  },
        { id: 'inid', name: 'Индустријско инжењерство ДУАЛНИ МОДУЛ', short: 'ИНИд' },
        { id: 'ds', name: 'Друмски саобраћај', short: 'ДС' },
        { id: 'rkts', name: 'Рачунарско-комуникационе технологије и системи', short: 'РКТС' },
        { id: 'rts', name: 'Рачунарске технологије и системи', short: 'РТС' },
        { id: 'kts', name: 'Комуникационе технологије и системи', short: 'КТС' },
        { id: 'kot', name: 'Комуникационе технологије', short: 'КOТ' },
        { id: 'srt', name: 'Савремене рачунарске технологије', short: 'СРТ' },
        { id: 'srtd', name: 'Савремене рачунарске технологије ДУАЛНИ МОДУЛ', short: 'СРТд' },
        { id: 'gi', name: 'Грађевинско инжењерство', short: 'ГИ' },
        { id: 'izzs', name: 'Инжењерство заштите животне средине', short: 'ИЗЖС' },
        { id: 'arh', name: 'Архитектура', short: 'АРХ' },
        { id: 'vsp', name: 'Струковни васпитач за рад са децом предшколског узраста', short: 'ВСП' },
];


export default function SchedulePage() {
  const [selectedProgram, setSelectedProgram] = useState('RKTS1');
    function handleClick(programId:string){
        setSelectedProgram(`${programId}1`);
    }
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
        <div className="flex-1 min-h-0">
            <ScheduleImage src={`src/img/${selectedProgram}.jpg`} />
        </div>
      {/* Smer selector */}
      <div className="w-[60vw] mx-auto py-[clamp(1rem,2vw,3rem)] overflow-hidden">
        <div className="flex gap-[clamp(0.5rem,1vw,1.5rem)] overflow-x-auto px-[clamp(1rem,2vw,3rem)] scrollbar-hide snap-x snap-mandatory scroll-smooth">
          {programs.map((program) => (
            <Button
              key={program.id}
              variant={selectedProgram === program.id ? 'default' : 'outline'}
              className={` flex flex-col justify-center items-center
        flex-none
        w-[clamp(180px,12vw,260px)]
        h-[clamp(120px,9vw,200px)]
        text-[clamp(14px,1.1vw,22px)]
        rounded-2xl transition-all duration-200${
                selectedProgram === program.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card hover:bg-accent text-card-foreground'
              }`}
              onClick={() => handleClick(program.id)}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{program.short}</div>
                <div className="text-sm leading-tight text-pretty">
                  {program.name}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
        {/*Selektor godine*/}

    </div>
  );
}
