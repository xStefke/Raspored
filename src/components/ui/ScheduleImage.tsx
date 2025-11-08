export default function ScheduleImage({
  src,
  alt = "Распоред",
}: ScheduleImageProps) {
  const isDefault = src.includes("default-schedule.jpg");

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden p-4">
      {isDefault ? (
        <div className="text-center text-muted-foreground">
          <h1 className="text-3xl font-semibold mb-2">Изаберите смер</h1>
          <p className="text-lg opacity-70">да прикажете распоред часова</p>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain rounded shadow-md"
        />
      )}
    </div>
  );
}
