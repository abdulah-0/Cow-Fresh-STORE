export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-[#001A57]">Contact Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-[#1C1C1E]/70 mb-6">We&apos;d love to hear from you!</p>
            <div className="space-y-4">
              <div className="flex items-start"><span className="text-[#45C517] mr-3">📞</span><div><p className="font-semibold">Phone</p><p className="text-[#1C1C1E]/70">+92 300 1234567</p></div></div>
              <div className="flex items-start"><span className="text-[#45C517] mr-3">📧</span><div><p className="font-semibold">Email</p><p className="text-[#1C1C1E]/70">hello@cowfresh.pk</p></div></div>
              <div className="flex items-start"><span className="text-[#45C517] mr-3">⏰</span><div><p className="font-semibold">Hours</p><p className="text-[#1C1C1E]/70">Mon-Sat: 9:00 AM - 8:00 PM</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}