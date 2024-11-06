import Pricing from "../components/Pricing";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <Pricing />
      </main>
    </>
  );
}