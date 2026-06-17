export default function Lines() {
  return (
    <div className="pointer-events-none fixed top-2 right-2 left-2 z-0 mix-blend-difference md:top-3 md:right-3 md:left-3">
      <div aria-hidden="true" className="flex justify-between md:hidden">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="block h-3 w-px shrink-0 bg-white" />
        ))}
      </div>

      <div aria-hidden="true" className="hidden justify-between md:flex">
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className="block h-3 w-px shrink-0 bg-white" />
        ))}
      </div>
    </div>
  );
}
