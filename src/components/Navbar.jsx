import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { navigate, routeLinkProps } from '../router.jsx';

gsap.registerPlugin(ScrollTrigger);

/* Submenu entries are plain strings unless they resolve to a real page,
   in which case they carry an `href` that the router picks up. */
const subLabel = (sub) => (typeof sub === 'string' ? sub : sub.label);
const subHref = (sub) => (typeof sub === 'string' ? null : sub.href);

/* Home, then four menus. An entry with no `items` renders as a plain link
   rather than a dropdown, which both the desktop bar and the mobile drawer
   already handle; `Home` additionally routes through `goHome`, so it returns
   to / from a sub-page and scrolls to the top when already there.

   Every entry that resolves to a real page keeps its `href` and therefore its
   route: the live pages are reachable as Platform → Omic Biomarker Quant,
   Omic Molecular Predict and Omic Spatial TME, Products → Breast Cancer and
   Lung Cancer, Investors → Research, and Company → About OmicMind. The rest are the plain strings they
   always were. */
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Platform',
    items: [
      { label: 'Omic Biomarker Quant', href: '/platform/biomarker-quantification' },
      { label: 'Omic Molecular Predict', href: '/platform/molecular-predict' },
      { label: 'Omic Treatment Response Predict', href: '/platform/treatment-response-predict' },
      { label: 'Omic Spatial TME', href: '/platform/spatial' },
    ],
  },
  {
    label: 'Products',
    items: [
      { label: 'OM Breast', href: '/platform/om-breast' },
      { label: 'OM Lung Immune', href: '/platform/om-lung' },
      { label: 'Colorectal Cancer', href: '/platform/om-colorectal' },
      { label: 'Breast Cancer', href: '/solutions/breast-cancer' },
      { label: 'Lung Cancer', href: '/solutions/lung-cancer' },
      'Precision Oncology',
      'Pan-Cancer Analysis',
    ],
  },
  {
    label: 'Investors',
    items: [{ label: 'Research', href: '/research' }, 'Publications'],
  },
  {
    label: 'Company',
    items: [{ label: 'About OmicMind', href: '/company/about' }, 'Careers', 'Partners'],
  },
];

/* Wordmark — pure text, no DNA glyph */
function Logo({ onClick }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const mark = el.querySelector('.logo-mark');
    const rule = el.querySelector('.logo-rule');

    const enter = () => {
      gsap.to(mark, { y: -1.5, duration: 0.45, ease: 'power3.out' });
      gsap.to(rule, { scaleX: 1, duration: 0.5, ease: 'power3.out' });
    };
    const leave = () => {
      gsap.to(mark, { y: 0, duration: 0.45, ease: 'power3.out' });
      gsap.to(rule, { scaleX: 0, duration: 0.35, ease: 'power2.in' });
    };

    gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <a
      ref={wrapRef}
      href="#"
      onClick={onClick}
      aria-label="OmicMind.ai home"
      className="group relative inline-flex shrink-0 items-baseline gap-[1px] outline-none"
    >
      <span className="logo-mark inline-flex items-baseline">
        <span className="font-serif text-[1.6rem] font-semibold leading-none tracking-[-0.015em] text-white md:text-[1.75rem]">
          OmicMind
        </span>
        <span className="font-serif text-[1.6rem] font-semibold leading-none tracking-[-0.015em] text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 md:text-[1.75rem]">
          .ai
        </span>
      </span>
      <span className="logo-rule pointer-events-none absolute -bottom-1.5 left-0 h-[1.5px] w-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />
    </a>
  );
}

/* Premium gradient pill CTA */
function DemoButton({ className = '', onClick }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const glow = el.querySelector('.cta-glow');
    const arrow = el.querySelector('.cta-arrow');

    const enter = () => {
      gsap.to(el, { scale: 1.045, duration: 0.4, ease: 'power3.out' });
      if (glow) gsap.to(glow, { opacity: 1, scale: 1.15, duration: 0.5, ease: 'power2.out' });
if (arrow) gsap.to(arrow, { x: 3, duration: 0.4, ease: 'power3.out' });
    };
    const leave = () => {
      gsap.to(el, { scale: 1, duration: 0.45, ease: 'power3.out' });
      if (glow) gsap.to(glow, { opacity: 0.55, scale: 1, duration: 0.5, ease: 'power2.out' });
if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: 'power3.out' });
    };
    const down = () => gsap.to(el, { scale: 0.97, duration: 0.15, ease: 'power2.out' });
    const up = () => gsap.to(el, { scale: 1.045, duration: 0.25, ease: 'power2.out' });

if (glow) gsap.set(glow, { opacity: 0.55 });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseup', up);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseup', up);
    };
  }, []);

  return (
    <div className={`relative inline-flex ${className}`}>
      <span className="cta-glow pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 blur-[14px]" />
      <button
        ref={btnRef}
        type="button"
        onClick={onClick}
        className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-5 py-2.5 font-sans text-[0.875rem] font-semibold tracking-[0.01em] text-white shadow-[0_6px_20px_rgba(168,85,247,0.35)] outline-none ring-1 ring-inset ring-white/25"
      >
        Request Demo
        <ArrowRight className="cta-arrow h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}

export default function Navbar() {
  const navRef = useRef(null);
  const rowRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const actionsRef = useRef(null);
  const burgerRef = useRef(null);
  const drawerRef = useRef(null);

  const panelRefs = useRef([]);
  const accRefs = useRef([]);
  const closeTimer = useRef(null);

  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(null);

  /* ---------- GSAP: entrance + scroll background transition ---------- */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Resting (top of page) navbar look
      gsap.set(navRef.current, {
        backgroundColor: 'rgba(5,8,22,0.65)',
        borderBottomColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
      });
      gsap.set(rowRef.current, { height: 84 });

      // Dropdown panels start hidden
      panelRefs.current.forEach((p) => {
        if (p) gsap.set(p, { autoAlpha: 0, y: -10, pointerEvents: 'none' });
      });

      const items = linksRef.current ? linksRef.current.querySelectorAll('.nav-item') : [];

      if (prefersReduced) {
        gsap.set([navRef.current, logoRef.current, actionsRef.current, ...items], {
          autoAlpha: 1,
          y: 0,
          x: 0,
          scale: 1,
        });
      } else {
        // Navbar entrance + menu item stagger
        const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

        tl.from(navRef.current, { y: -96, autoAlpha: 0, duration: 0.95 })
          .from(logoRef.current, { x: -18, autoAlpha: 0, duration: 0.7 }, 0.28)
          .from(items, { y: -12, autoAlpha: 0, duration: 0.6, stagger: 0.07 }, 0.36)
          .from(actionsRef.current, { autoAlpha: 0, scale: 0.9, duration: 0.6 }, 0.62);
      }

      // Smooth background / elevation transition while scrolling
      const scrolledTl = gsap
        .timeline({ paused: true, defaults: { duration: 0.45, ease: 'power2.out' } })
        .to(
          navRef.current,
          {
            backgroundColor: 'rgba(5,8,22,0.88)',
            borderBottomColor: 'rgba(255,255,255,0.10)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25), 0 1px 0 rgba(139,92,246,0.06)',
          },
          0
        )
        .to(rowRef.current, { height: 68 }, 0);

      ScrollTrigger.create({
        start: 48,
        end: 'max',
        onEnter: () => scrolledTl.play(),
        onLeaveBack: () => scrolledTl.reverse(),
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  /* ---------- Desktop dropdown fade + slide ---------- */
  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const links = panel.querySelectorAll('.dd-link');
      gsap.killTweensOf([panel, links]);

      if (i === openIndex) {
        gsap.to(panel, {
          autoAlpha: 1,
          y: 0,
          duration: 0.34,
          ease: 'power3.out',
          pointerEvents: 'auto',
        });
        gsap.fromTo(
          links,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.035, delay: 0.05 }
        );
      } else {
        gsap.to(panel, {
          autoAlpha: 0,
          y: -10,
          duration: 0.2,
          ease: 'power2.in',
          pointerEvents: 'none',
        });
      }
    });
  }, [openIndex]);

  /* ---------- Mobile drawer ---------- */
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const rows = drawer.querySelectorAll('.m-row');
    const foot = drawer.querySelector('.m-foot');

    gsap.killTweensOf([drawer, rows, foot]);

    if (mobileOpen) {
      gsap.set(drawer, { pointerEvents: 'auto' });
      gsap.to(drawer, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(
        rows,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.055, delay: 0.1 }
      );
      gsap.fromTo(
        foot,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.34 }
      );
    } else {
      gsap.to(drawer, {
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.in',
        pointerEvents: 'none',
      });
    }

    // Hamburger → X
    const top = burgerRef.current?.querySelector('.bar-top');
    const bottom = burgerRef.current?.querySelector('.bar-bottom');
    if (top && bottom) {
      gsap.to(top, {
        y: mobileOpen ? 3.5 : 0,
        rotate: mobileOpen ? 45 : 0,
        width: mobileOpen ? 20 : 22,
        duration: 0.35,
        ease: 'power3.out',
      });
      gsap.to(bottom, {
        y: mobileOpen ? -3.5 : 0,
        rotate: mobileOpen ? -45 : 0,
        width: mobileOpen ? 20 : 15,
        duration: 0.35,
        ease: 'power3.out',
      });
    }

    // Lock page scroll while the drawer is open
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [mobileOpen]);

  /* ---------- Mobile accordions ---------- */
  useEffect(() => {
    accRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      if (i === accOpen) {
        gsap.to(el, { height: 'auto', autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
      } else {
        gsap.to(el, { height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' });
      }
    });
  }, [accOpen]);

  /* ---------- Close on Escape / resize to desktop ---------- */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenIndex(null);
        setMobileOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const hoverOpen = (i) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };
  const hoverClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 150);
  };

  const goHome = (e) => {
    e.preventDefault();
    setOpenIndex(null);
    setMobileOpen(false);
    // On a sub-page the logo/Home link has to route back, not just scroll.
    if (window.location.pathname !== '/') {
      navigate('/');
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed inset-x-0 top-0 z-[200] w-full border-b"
        style={{
          willChange: 'background-color, box-shadow, transform',
          backdropFilter: 'blur(16px) saturate(150%)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        }}
      >
        <div
          ref={rowRef}
          className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10"
        >
          {/* Left — logo */}
          <div ref={logoRef} className="flex items-center">
            <Logo onClick={goHome} />
          </div>

          {/* Center — desktop navigation */}
          <nav
            ref={linksRef}
            aria-label="Main navigation"
            className="hidden flex-1 items-center justify-center lg:flex"
          >
            <ul className="flex items-center gap-0.5 xl:gap-1.5">
              {NAV_ITEMS.map((item, i) => {
                const hasMenu = Boolean(item.items);
                return (
                  <li
                    key={item.label}
                    className="nav-item relative"
                    onMouseEnter={() => (hasMenu ? hoverOpen(i) : hoverClose())}
                    onMouseLeave={hoverClose}
                  >
                    {hasMenu ? (
                      <button
                        type="button"
                        aria-expanded={openIndex === i}
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className={`group inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-sans text-[0.875rem] font-medium tracking-[0.005em] transition-colors duration-300 xl:px-4 ${
                          openIndex === i
                            ? 'bg-white/[0.07] text-white shadow-[0_0_20px_-6px_rgba(139,92,246,0.45)]'
                            : 'text-[#D9E2F2] hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-3.5 w-3.5 text-[#D9E2F2]/60 transition-transform duration-300 group-hover:text-white/80 ${
                            openIndex === i ? 'rotate-180' : ''
                          }`}
                          strokeWidth={2.25}
                        />
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        onClick={item.label === 'Home' ? goHome : (e) => e.preventDefault()}
                        className="inline-flex items-center rounded-full px-3.5 py-2 font-sans text-[0.875rem] font-medium tracking-[0.005em] text-[#D9E2F2] transition-colors duration-300 hover:bg-white/[0.06] hover:text-white xl:px-4"
                      >
                        {item.label}
                      </a>
                    )}

                    {/* Dropdown */}
                    {hasMenu && (
                      <div
                        ref={(el) => {
                          panelRefs.current[i] = el;
                        }}
                        className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3"
                      >
                        <div
                          className="relative min-w-[16rem] overflow-hidden rounded-2xl border border-white/10 p-2 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]"
                          style={{
                            backgroundColor: 'rgba(5,8,22,0.90)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                          }}
                        >
                          <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent" />
                          <ul className="relative">
                            {item.items.map((sub) => {
                              const label = subLabel(sub);
                              const href = subHref(sub);
                              const linkProps = href
                                ? routeLinkProps(href, () => setOpenIndex(null))
                                : {
                                    href: '#',
                                    onClick: (e) => {
                                      e.preventDefault();
                                      setOpenIndex(null);
                                    },
                                  };
                              return (
                                <li key={label}>
                                  <a
                                    {...linkProps}
                                    className="dd-link group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-sans text-[0.85rem] font-medium text-[#D9E2F2] transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
                                  >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:shadow-[0_0_8px_rgba(192,38,211,0.55)]" />
                                    <span className="whitespace-nowrap">{label}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right — CTA + hamburger */}
          <div ref={actionsRef} className="flex shrink-0 items-center gap-3">
            <DemoButton className="hidden sm:inline-flex" />

            <button
              ref={burgerRef}
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition-colors duration-300 hover:bg-white/[0.12] lg:hidden"
            >
              <span className="flex h-4 w-[22px] flex-col items-start justify-center gap-[5px]">
                <span className="bar-top block h-[2px] w-[22px] rounded-full bg-[#D9E2F2]" />
                <span className="bar-bottom block h-[2px] w-[15px] rounded-full bg-[#D9E2F2]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen drawer */}
      <div
        ref={drawerRef}
        className="fixed inset-0 z-[190] overflow-y-auto lg:hidden"
        style={{
          opacity: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          backgroundColor: 'rgba(5,8,22,0.94)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <div className="min-h-full px-6 pb-14 pt-28">
          <nav aria-label="Mobile navigation">
            <ul className="divide-y divide-white/[0.08]">
              {NAV_ITEMS.map((item, i) => {
                const hasMenu = Boolean(item.items);
                return (
                  <li key={item.label} className="m-row py-1">
                    {hasMenu ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={accOpen === i}
                          onClick={() => setAccOpen(accOpen === i ? null : i)}
                          className="flex w-full items-center justify-between py-4 text-left"
                        >
                          <span className="font-sans text-[1.0625rem] font-semibold tracking-[-0.005em] text-white">
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-[#D9E2F2]/60 transition-transform duration-300 ${
                              accOpen === i ? 'rotate-180' : ''
                            }`}
                            strokeWidth={2.25}
                          />
                        </button>
                        <div
                          ref={(el) => {
                            accRefs.current[i] = el;
                          }}
                          className="overflow-hidden"
                          style={{ height: 0, opacity: 0 }}
                        >
                          <ul className="mb-3 ml-1 space-y-0.5 border-l border-white/10 pl-4">
                            {item.items.map((sub) => {
                              const label = subLabel(sub);
                              const href = subHref(sub);
                              const linkProps = href
                                ? routeLinkProps(href, () => setMobileOpen(false))
                                : {
                                    href: '#',
                                    onClick: (e) => {
                                      e.preventDefault();
                                      setMobileOpen(false);
                                    },
                                  };
                              return (
                                <li key={label}>
                                  <a
                                    {...linkProps}
                                    className="flex items-center gap-2.5 rounded-lg px-1 py-2.5 font-sans text-[0.9375rem] text-[#D9E2F2] active:text-white"
                                  >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                                    {label}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <a
                        href={item.href}
                        onClick={item.label === 'Home' ? goHome : (e) => {
                          e.preventDefault();
                          setMobileOpen(false);
                        }}
                        className="block py-4 font-sans text-[1.0625rem] font-semibold tracking-[-0.005em] text-white"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="m-foot mt-10">
            <DemoButton className="w-full [&>button]:w-full [&>button]:justify-center [&>button]:py-3.5 [&>button]:text-[0.9375rem]" onClick={() => setMobileOpen(false)} />
            <p className="mt-6 font-sans text-[0.8125rem] leading-relaxed text-[#D9E2F2]/60">
              OmicMind.ai — multi-omics AI intelligence for digital pathology and precision
              oncology.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
