type Props = {
  close: () => void;
};

export default function About({ close }: Props) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-40">
      <div className="max-w-xl text-center">
        <p>About the filmmaker...</p>
        <button onClick={close} className="mt-6">
          Close
        </button>
      </div>
    </div>
  );
}