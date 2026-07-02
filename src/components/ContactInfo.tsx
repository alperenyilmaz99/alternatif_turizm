import {
  getTelUrl,
  getWhatsAppUrlForPhone,
  SITE_CONTACTS,
} from "@/lib/contacts";

interface ContactInfoProps {
  className?: string;
  showRegions?: boolean;
}

export default function ContactInfo({
  className = "",
  showRegions = true,
}: ContactInfoProps) {
  return (
    <div
      className={`rounded-xl border border-teal-100 bg-teal-50/60 p-4 sm:p-5 ${className}`}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-800">
        İletişim
      </h3>
      <ul className="mt-3 space-y-3">
        {SITE_CONTACTS.map((contact) => (
          <li key={contact.phoneE164}>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-slate-800">{contact.name}</span>
              <a
                href={getTelUrl(contact.phoneE164)}
                className="font-medium text-teal-700 transition hover:text-teal-800"
              >
                {contact.phoneDisplay}
              </a>
            </div>
            {showRegions && (
              <p className="mt-0.5 text-xs text-slate-500">{contact.region}</p>
            )}
            <div className="mt-2 flex gap-2">
              <a
                href={getTelUrl(contact.phoneE164)}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-teal-700"
              >
                Ara
              </a>
              <a
                href={getWhatsAppUrlForPhone(
                  contact.phoneE164,
                  "Merhaba, devremülk ilanlarınız hakkında bilgi almak istiyorum."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-1 text-xs font-medium text-white transition hover:bg-[#20bd5a]"
              >
                WhatsApp
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
