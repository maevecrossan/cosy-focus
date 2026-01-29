import Image from "next/image";
import FocusBoard from "../components/focus/FocusBoard";

export default function Home() {
  return (
    <div className="w-full h-full">
      <main>
        <FocusBoard />
      </main>
    </div>
  );
}
