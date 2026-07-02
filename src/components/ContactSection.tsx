import Image from "next/image";
import SubmissionForm from "./SubmissionForm";

export default function ContactSection() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-2 lg:gap-16">
        <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-teal-900/5 backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Devremülk Kiralama-Satış Formu
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Kiralamak veya satmak istediğiniz devremülk bilgilerini formu
            doldurarak bize gönderin. Uzman ekibimiz en kısa sürede sizinle
            iletişime geçecektir.
          </p>
          <div className="mt-8">
            <SubmissionForm />
          </div>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl shadow-xl lg:block">
          <Image
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
            alt="Lüks otel ve termal tatil"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-lg font-semibold text-white">
              Hayalinizdeki tatili paylaşın
            </p>
            <p className="mt-1 text-sm text-white/80">
              Binlerce kişiye ulaşın, devremülkünüzü kolayca değerlendirin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
