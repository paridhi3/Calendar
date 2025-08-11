import Calendar from "../components/Calendar";
import ThemeToggle from "../components/ThemeToggle";

export default function Page() {
  return (
    <main className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 bg-size-200 animate-gradient-x p-6 mx-auto">
      <Calendar />
    </main>
  );
}
