import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700">
          Betting Advisor
        </Link>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <Link href="/core" className="hover:text-gray-900">Core</Link>
          <Link href="/research" className="hover:text-gray-900">Research</Link>
          <Link href="/product" className="hover:text-gray-900">Product</Link>
          <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
          <Link href="/docs" className="hover:text-gray-900">Docs</Link>
        </div>
      </div>
    </nav>
  );
}
