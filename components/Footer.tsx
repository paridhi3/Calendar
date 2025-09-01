export default function Footer() {
  return (
    <footer className="bg-gray-300 py-6">
      <div className="text-center text-sm text-gray-600">
        Copyright &copy; {new Date().getFullYear()} Calendar. All rights
        reserved.
      </div>
    </footer>
  );
}
