export default function ScheduleImage({
  src,
  alt = "Распоред",
}: {
  src: string;
  alt?: string;
}) {
  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden p-4">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded shadow-md"
      />
    </div>
  );
}
