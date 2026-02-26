import PropTypes from "prop-types";
import bgDefault from "@/assets/courses/hero.jpg";
import { MdArrowForward } from "react-icons/md";

export default function Hero({
  title = "Test de inicio",
  subtitle = "Conoce a ti mismo",
  ctaLabel = "Empezar",
  onCtaClick = () => {},
  bgImage = bgDefault,
  badge,
  className = "",
  /** @deprecated use quickLinks instead */
  reminder = null,
  /**
   * Array of ghost-pill quick-action buttons displayed inline above the CTA.
   * Each entry: { label: string, onClick: () => void }
   */
  quickLinks = [],
}) {
  // Merge legacy reminder into quickLinks so old callers still work
  const links = quickLinks.length
    ? quickLinks
    : reminder
    ? [{ label: reminder.actionLabel, onClick: reminder.onAction }]
    : [];

  return (
    <section
      className={[
        "relative overflow-hidden rounded-[28px] ring-1 ring-white/10",
        "shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)]",
        "transition-shadow duration-200 hover:shadow-[0_22px_55px_-20px_rgba(0,0,0,0.6)]",
        className,
      ].join(" ")}
      aria-label={title}
    >
      <img
        src={bgImage}
        alt=""
        aria-hidden
        className="h-[220px] w-full object-cover md:h-[280px] lg:h-[320px] select-none"
        draggable={false}
      />

      {/* overlay gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0" />

      {/* text + actions anchored to bottom-left */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-6 py-5 sm:px-8 sm:py-6 space-y-2.5">
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl drop-shadow">
            {title}
          </h2>
          <p className="text-white/80 text-sm drop-shadow-sm">{subtitle}</p>

          {/* ghost-pill quick links + primary CTA in one row */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {links.map((lnk) => (
              <button
                key={lnk.label}
                onClick={lnk.onClick}
                className="inline-flex items-center rounded-2xl
                           bg-white/10 hover:bg-white/18 active:bg-white/25
                           ring-1 ring-white/20 backdrop-blur
                           px-4 py-1.5 text-xs font-medium text-white/90
                           transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                           shadow-[0_4px_14px_-6px_rgba(0,0,0,0.5)]"
              >
                {lnk.label}
              </button>
            ))}

            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#00b5e2]
                         px-5 py-2 text-sm font-semibold text-white
                         transition-transform duration-150
                         hover:brightness-110 active:scale-[0.97]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                         shadow-[0_6px_18px_-6px_rgba(0,181,226,0.7)]"
              aria-label={ctaLabel}
            >
              {ctaLabel} <MdArrowForward className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {badge && (
        <span
          className="absolute right-4 top-4 rounded-full bg-white/12 px-3 py-1 text-xs
                     ring-1 ring-white/15 backdrop-blur-[1px]
                     shadow-[0_6px_16px_-8px_rgba(0,0,0,0.5)]"
        >
          {badge}
        </span>
      )}
    </section>
  );
}

Hero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  ctaLabel: PropTypes.string,
  onCtaClick: PropTypes.func,
  bgImage: PropTypes.string,
  badge: PropTypes.string,
  className: PropTypes.string,
  quickLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  reminder: PropTypes.shape({
    text: PropTypes.string,
    actionLabel: PropTypes.string.isRequired,
    onAction: PropTypes.func.isRequired,
  }),
};
