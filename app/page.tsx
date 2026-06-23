import { HeroSection } from "@/app/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-[#001A57]">Why Cow Fresh?</h2>
        <p className="text-center text-[#1C1C1E]/70 mb-12 max-w-2xl mx-auto">We bring farm-fresh dairy products straight to your door.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🥛</div>
            <h3 className="font-semibold text-xl mb-2 text-[#001A57]">100% Natural</h3>
            <p className="text-[#1C1C1E]/70">No preservatives, no additives.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-semibold text-xl mb-2 text-[#001A57]">Farm to Door</h3>
            <p className="text-[#1C1C1E]/70">Fresh from the farm to your doorstep.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">💧</div>
            <h3 className="font-semibold text-xl mb-2 text-[#001A57]">Premium Quality</h3>
            <p className="text-[#1C1C1E]/70">Desi ghee, almond milk, lassi.</p>
          </div>
        </div>
      </section>
    </main>
  );
}