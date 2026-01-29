import Image from "next/image";
import FocusBoard from "../components/focus/FocusBoard";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <main>
        <FocusBoard />
      </main>
    </div>
  );
}
