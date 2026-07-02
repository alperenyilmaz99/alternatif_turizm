import Image from "next/image";
import ContactInfo from "./ContactInfo";
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
            Kiraya vermek yada satmak istediğiniz devremülklerinizi form
            doldurarak bize gönderiniz. Uzman ekibimiz en kısa sürede sizinle
            iletişime geçecektir.
          </p>
          <ContactInfo className="mt-6" />
          <div className="mt-8">
            <SubmissionForm />
          </div>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl shadow-xl lg:block">
          <Image
            src="/contact-hero.png"
            alt="Doğada şifalı su ve huzurlu tatil"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-lg font-semibold text-white">
              Binlerce kişiye ulaşın, devremülkünüzü kolayca değerlendirin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
