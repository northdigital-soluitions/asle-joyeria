"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Hook para detectar móvil ─────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Datos ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  src: string;
  name: string;
  price: string;
  badge?: string;
}

const products: Product[] = [
  { id: 1, src: "/joya1.jpg", name: "Collar con dije de corazón de oro laminado", price: "$899 MXN", badge: "Popular" },
  { id: 2, src: "/joya2.jpg", name: "Pulsera trenzada de acero inoxidable",        price: "$599 MXN", badge: "Nuevo"   },
  { id: 3, src: "/joya3.jpg", name: "Aretes gota de acero inoxidable",             price: "$299 MXN"                   },
];

const WA_NUMBER = "522283145334";
const IG_USER   = "asle_joyeria";

function buildWaLink(name: string, price: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`¡Hola! Quiero comprar: ${name} (${price}). ¿Me pueden dar más información?`)}`;
}

// ─── Partículas (solo desktop) ────────────────────────────────────────────────

function FloatingParticles() {
  const particles = [
    { size:3, x:10, y:20, delay:0,   dur:8  }, { size:2, x:80, y:10, delay:1.5, dur:10 },
    { size:4, x:25, y:70, delay:0.8, dur:9  }, { size:2, x:65, y:55, delay:2.2, dur:11 },
    { size:3, x:90, y:75, delay:0.4, dur:7  }, { size:2, x:45, y:85, delay:3.0, dur:12 },
    { size:5, x:15, y:45, delay:1.2, dur:9  }, { size:2, x:75, y:30, delay:2.5, dur:8  },
    { size:3, x:55, y:15, delay:0.6, dur:10 }, { size:2, x:35, y:60, delay:1.8, dur:11 },
  ];
  const lines = [
    { x1:5,  y1:30, len:40, angle:-30, delay:0,   dur:14 }, { x1:70, y1:15, len:55, angle:45,  delay:2,   dur:16 },
    { x1:85, y1:60, len:35, angle:-60, delay:1,   dur:12 }, { x1:20, y1:80, len:48, angle:20,  delay:3,   dur:15 },
    { x1:50, y1:5,  len:30, angle:70,  delay:0.5, dur:13 },
  ];
  const diamonds = [
    { x:88, y:18, size:10, delay:0, dur:9 }, { x:8,  y:60, size:8, delay:2, dur:11 },
    { x:55, y:88, size:7,  delay:1, dur:10}, { x:72, y:72, size:9, delay:3, dur:8  },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes floatUp    { 0%,100%{transform:translateY(0) scale(1);opacity:.4} 50%{transform:translateY(-18px) scale(1.15);opacity:.8} }
        @keyframes floatDrift { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.2} 33%{transform:translateY(-12px) rotate(5deg);opacity:.45} 66%{transform:translateY(6px) rotate(-3deg);opacity:.25} }
        @keyframes spinSlow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer    { 0%,100%{opacity:.15} 50%{opacity:.5} }
      `}</style>
      {particles.map((p,i) => <div key={`p${i}`} className="absolute rounded-full bg-[#1f3a5f]"
        style={{width:p.size,height:p.size,left:`${p.x}%`,top:`${p.y}%`,animation:`floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`}} />)}
      {lines.map((l,i) => <div key={`l${i}`} className="absolute bg-[#1f3a5f]"
        style={{width:l.len,height:1,left:`${l.x1}%`,top:`${l.y1}%`,transform:`rotate(${l.angle}deg)`,transformOrigin:"left center",animation:`shimmer ${l.dur}s ease-in-out ${l.delay}s infinite`}} />)}
      {diamonds.map((d,i) => <div key={`d${i}`} className="absolute border border-[#1f3a5f]"
        style={{width:d.size,height:d.size,left:`${d.x}%`,top:`${d.y}%`,transform:"rotate(45deg)",animation:`floatDrift ${d.dur}s ease-in-out ${d.delay}s infinite`}} />)}
      <div className="absolute border border-[#1f3a5f]/10 rounded-full"
        style={{width:340,height:340,left:"50%",top:"50%",marginLeft:-170,marginTop:-170,animation:"spinSlow 30s linear infinite"}} />
      <div className="absolute border border-[#1f3a5f]/8 rounded-full"
        style={{width:500,height:500,left:"50%",top:"50%",marginLeft:-250,marginTop:-250,animation:"spinSlow 50s linear infinite reverse"}} />
    </div>
  );
}

// ─── Modal de detalle (compartido) ────────────────────────────────────────────

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => { clearTimeout(t); window.removeEventListener("keydown", h); };
  }, []);
  const handleClose = () => { setMounted(false); setTimeout(onClose, 350); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: mounted ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
        backdropFilter: mounted ? "blur(6px)" : "blur(0px)",
        transition: "background 0.35s ease, backdrop-filter 0.35s ease" }}
      onClick={handleClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
          opacity: mounted ? 1 : 0,
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease" }}
        className="bg-[#faf8f4] rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl">
        <div className="relative w-full aspect-square bg-[#ede9df] overflow-hidden">
          <Image src={product.src} alt={product.name} fill className="object-cover" sizes="400px"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-[#1f3a5f] text-white text-xs px-3 py-1 rounded-full tracking-wider uppercase"
              style={{ fontFamily:"var(--font-body,sans-serif)" }}>{product.badge}</span>
          )}
          <button onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#1f3a5f] hover:bg-white hover:rotate-90 transition-all duration-300 text-lg font-light shadow-md">×</button>
        </div>
        <div className="p-6 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="h-px w-8 bg-[#d4c9a8]" /><span className="text-[#d4c9a8] text-xs">✦</span><div className="h-px w-8 bg-[#d4c9a8]" />
          </div>
          <h3 className="text-[#1f3a5f] text-xl leading-snug mb-2"
            style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>{product.name}</h3>
          <p className="text-[#8a7a60] text-3xl mb-6"
            style={{ fontFamily:"var(--font-display,serif)", fontWeight:400 }}>{product.price}</p>
          <a href={buildWaLink(product.name, product.price)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25d366] text-white rounded-full hover:bg-[#1ebe5d] hover:shadow-lg hover:shadow-[#25d366]/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 text-xs tracking-widest uppercase"
            style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:500 }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Comprar por WhatsApp
          </a>
          <button onClick={handleClose}
            className="mt-3 w-full py-2.5 text-[#5a6e85] text-xs tracking-widest uppercase hover:text-[#1f3a5f] hover:tracking-[0.35em] transition-all duration-300"
            style={{ fontFamily:"var(--font-body,sans-serif)" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ─── ProductCard (compartido) ─────────────────────────────────────────────────

function ProductCard({ product, onDetail }: { product: Product; onDetail: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold:0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} onClick={onDetail}
      className="group relative bg-[#faf8f4] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
      style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(32px)",
        transition:`opacity 0.6s ease ${product.id*100}ms, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${product.id*100}ms, box-shadow 0.3s ease` }}>
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 bg-[#1f3a5f] text-white text-xs px-3 py-1 rounded-full tracking-wider uppercase"
          style={{ fontFamily:"var(--font-body,sans-serif)" }}>{product.badge}</span>
      )}
      <div className="relative w-full aspect-square overflow-hidden bg-[#ede9df]">
        <Image src={product.src} alt={product.name} fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width:768px) 100vw, 33vw"
          onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Image src="/asle_imagen.png" alt="" width={48} height={48} className="drop-shadow-lg" />
        </div>
        <div className="absolute inset-0 bg-[#1f3a5f]/0 group-hover:bg-[#1f3a5f]/12 transition-colors duration-300" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white/90 backdrop-blur text-[#1f3a5f] text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md"
            style={{ fontFamily:"var(--font-body,sans-serif)" }}>ver detalle</span>
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="text-[#1f3a5f] text-sm leading-snug mb-1"
          style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>{product.name}</h3>
        <p className="text-[#8a7a60] text-lg mb-4"
          style={{ fontFamily:"var(--font-display,serif)", fontWeight:400 }}>{product.price}</p>
        <div className="w-full py-2.5 border border-[#1f3a5f]/30 text-[#1f3a5f] text-xs rounded-full group-hover:border-[#1f3a5f] group-hover:bg-[#1f3a5f] group-hover:text-white transition-all duration-300 tracking-widest uppercase"
          style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:500 }}>Ver detalle</div>
      </div>
    </div>
  );
}

// ─── Secciones compartidas ────────────────────────────────────────────────────

function ValorSection() {
  return (
    <section id="nosotros" className="py-20 px-6 bg-[#1f3a5f] text-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {[
          { icon:"✦", title:"Materiales de calidad", desc:"Oro laminado y acero inoxidable que resisten el tiempo." },
          { icon:"◈", title:"Diseño artesanal",      desc:"Cada pieza es elaborada con cuidado y atención al detalle." },
          { icon:"❋", title:"Envío a todo México",   desc:"Recibe tu joya en la puerta de tu casa, seguro y rápido." },
        ].map(item => (
          <div key={item.title}
            className="group flex flex-col items-center gap-3 p-6 rounded-2xl cursor-default hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
            <span className="text-3xl text-[#d4c9a8] transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">{item.icon}</span>
            <h3 className="text-lg" style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>{item.title}</h3>
            <p className="text-[#a8bdd1] text-sm leading-relaxed" style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:300 }}>{item.desc}</p>
            <div className="h-px w-0 bg-[#d4c9a8]/40 group-hover:w-12 transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactoSection() {
  return (
    <section id="contacto" className="py-20 px-6 bg-white text-center">
      <p className="text-xs tracking-[0.4em] uppercase text-[#8a7a60] mb-3" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Escríbenos</p>
      <h2 className="text-3xl text-[#1f3a5f] mb-4" style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>¿Te interesa alguna pieza?</h2>
      <p className="text-[#7a8fa6] mb-8 max-w-sm mx-auto text-sm leading-relaxed" style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:300 }}>
        Contáctanos por WhatsApp y con gusto te asesoramos.
      </p>
      <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("¡Hola! Me gustaría conocer más sobre sus joyas.")}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25d366] text-white rounded-full hover:bg-[#1ebe5d] hover:scale-105 hover:shadow-lg hover:shadow-[#25d366]/40 transition-all duration-200 text-xs tracking-widest uppercase"
        style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:500 }}>
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Contactar por WhatsApp
      </a>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="py-10 px-6 bg-[#1f3a5f] text-center">
      <Image src="/logo.png" alt="Aslé Joyería" width={52} height={52} className="mx-auto mb-4 opacity-80" />
      <p className="text-[#a8bdd1] text-xs tracking-[0.3em] uppercase" style={{ fontFamily:"var(--font-body,sans-serif)" }}>
        © {new Date().getFullYear()} Aslé Joyería · Todos los derechos reservados
      </p>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIÓN DESKTOP
// ═══════════════════════════════════════════════════════════════════════════════

function DesktopLayout() {
  const catalogRef = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [panel, setPanel] = useState<null | "about" | "ig">(null);
  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior:"smooth" });
  const togglePanel = (side: "about" | "ig") => setPanel(p => p === side ? null : side);

  const IgIcon = ({ id }: { id: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke={`url(#${id})`} strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke={`url(#${id})`} strokeWidth="2" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill={`url(#${id})`}/>
    </svg>
  );

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#1f3a5f]">
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-4 bg-[#f5f1e8]/80 backdrop-blur-md border-b border-[#e0d9cc]">
        <a href="/" className="flex items-center">
          <Image src="/logo.png" alt="Aslé Joyería" width={56} height={56} />
        </a>
        <div className="flex gap-8 text-[#5a6e85]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>
          <button onClick={scrollToCatalog} className="hover:text-[#1f3a5f] transition-colors uppercase text-xs tracking-widest">Catálogo</button>
          <a href="#nosotros" className="hover:text-[#1f3a5f] transition-colors uppercase text-xs tracking-widest">Nosotros</a>
          <a href="#contacto" className="hover:text-[#1f3a5f] transition-colors uppercase text-xs tracking-widest">Contacto</a>
        </div>
        <button onClick={scrollToCatalog}
          className="text-xs px-5 py-2.5 bg-[#1f3a5f] text-white rounded-full hover:bg-[#162a45] transition-colors tracking-widest uppercase"
          style={{ fontFamily:"var(--font-body,sans-serif)" }}>Ver catálogo</button>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20 overflow-hidden">
        <FloatingParticles />
        <div className="absolute w-96 h-96 rounded-full bg-[#d4c9a8]/25 blur-3xl pointer-events-none" />

        <div className="relative flex items-center justify-center w-full max-w-3xl">
          {/* Panel IZQUIERDO — Sobre Aslé */}
          <div className="absolute right-[calc(50%+60px)] overflow-hidden transition-all duration-700 ease-in-out"
            style={{ width:panel==="about"?"240px":"0px", opacity:panel==="about"?1:0, pointerEvents:panel==="about"?"auto":"none" }}>
            <div className="bg-[#1f3a5f] rounded-2xl px-6 py-8 text-left shadow-2xl" style={{ width:240 }}>
              <p className="text-[#d4c9a8] text-[9px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Quiénes somos</p>
              <h3 className="text-white text-xl leading-tight mb-3" style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>Aslé Joyería</h3>
              <p className="text-[#a8bdd1] text-sm leading-relaxed" style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:300 }}>
                Somos una joyería que desde <span className="text-[#d4c9a8] font-medium">2023</span> nos esforzamos por dar a nuestros clientes productos de la más alta calidad. Cada pieza es una historia, cada diseño refleja elegancia y cuidado artesanal.
              </p>
              <button onClick={() => setPanel(null)}
                className="mt-5 text-[9px] tracking-[0.3em] uppercase text-[#d4c9a8]/60 hover:text-[#d4c9a8] transition-colors"
                style={{ fontFamily:"var(--font-body,sans-serif)" }}>← cerrar</button>
            </div>
          </div>

          {/* LOGO central */}
          <div className="relative z-10 transition-all duration-700 ease-in-out cursor-pointer select-none"
            style={{ transform: panel==="about"?"translateX(80px)":panel==="ig"?"translateX(-80px)":"translateX(0px)" }}>
            <div className="relative group" onClick={() => togglePanel("about")} title="Conoce nuestra historia">
              <div className="absolute inset-0 rounded-full bg-[#1f3a5f]/10 scale-125 blur-xl group-hover:bg-[#1f3a5f]/20 transition-all duration-500" />
              <Image src="/logo.png" alt="Aslé Joyería" width={180} height={180}
                className="relative drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
                style={{ filter:panel?"brightness(0.85)":"brightness(1)" }} />
              {panel === null && (
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] uppercase text-[#8a7a60] whitespace-nowrap opacity-70"
                  style={{ fontFamily:"var(--font-body,sans-serif)" }}>tócame</span>
              )}
            </div>
            {/* Botón Instagram */}
            <button onClick={e => { e.stopPropagation(); togglePanel("ig"); }} title="Ver nuestro Instagram"
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform duration-200 z-20"
              style={{ opacity:panel==="about"?0:1, transition:"opacity 0.3s, transform 0.2s" }}>
              <IgIcon id="ig-btn" />
            </button>
          </div>

          {/* Panel DERECHO — Instagram */}
          <div className="absolute left-[calc(50%+60px)] overflow-hidden transition-all duration-700 ease-in-out"
            style={{ width:panel==="ig"?"220px":"0px", opacity:panel==="ig"?1:0, pointerEvents:panel==="ig"?"auto":"none" }}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ width:220 }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-[#ede9df] flex-shrink-0">
                  <Image src="/logo.png" alt="Aslé" width={28} height={28} className="object-cover" />
                </div>
                <span className="text-xs font-semibold text-gray-800" style={{ fontFamily:"var(--font-body,sans-serif)" }}>asle_joyeria</span>
              </div>
              <div className="relative w-full aspect-square bg-[#ede9df]">
                <Image src="/foto_instagram.jpg" alt="Aslé Joyería en Instagram" fill className="object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
              </div>
              <a href={`https://www.instagram.com/${IG_USER}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-4 hover:bg-gray-50 transition-colors">
                <IgIcon id="ig-footer" />
                <span className="text-[10px] tracking-wide text-gray-500 hover:text-gray-700" style={{ fontFamily:"var(--font-body,sans-serif)" }}>
                  Síguenos en Instagram
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="transition-all duration-500 mt-14"
          style={{ opacity:panel?0:1, transform:panel?"translateY(8px)":"translateY(0)" }}>
          <p className="text-xs tracking-[0.4em] uppercase text-[#8a7a60] mb-4" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Joyería artesanal</p>
          <p className="text-[#7a8fa6] max-w-sm text-base leading-relaxed mx-auto" style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:300 }}>
            Elegancia que perdura. Diseños hechos para resaltar tu esencia.
          </p>
          <button onClick={scrollToCatalog}
            className="mt-8 px-8 py-3.5 bg-[#1f3a5f] text-white rounded-full hover:bg-[#162a45] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#1f3a5f]/20 tracking-widest uppercase text-xs"
            style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:500 }}>Ver catálogo</button>
        </div>
        <div className="absolute bottom-10 flex flex-col items-center gap-1 animate-bounce opacity-30">
          <div className="w-px h-8 bg-[#1f3a5f]" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>scroll</span>
        </div>
      </section>

      <ValorSection />

      {/* CATÁLOGO */}
      <section ref={catalogRef} className="py-24 px-6 bg-[#f5f1e8]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-[0.4em] uppercase text-[#8a7a60] mb-3" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Colección</p>
          <h2 className="text-center text-4xl text-[#1f3a5f] mb-14" style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>Catálogo</h2>
          <div className="grid grid-cols-3 gap-8">
            {products.map(p => <ProductCard key={p.id} product={p} onDetail={() => setSelectedProduct(p)} />)}
          </div>
        </div>
      </section>

      <ContactoSection />
      <FooterSection />
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSIÓN MÓVIL
// ═══════════════════════════════════════════════════════════════════════════════

function MobileLayout() {
  const catalogRef = useRef<HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollToCatalog = () => { catalogRef.current?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#1f3a5f]">
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* NAVBAR MÓVIL */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-3 bg-[#f5f1e8]/90 backdrop-blur-md border-b border-[#e0d9cc]">
        <a href="/">
          <Image src="/logo.png" alt="Aslé Joyería" width={44} height={44} />
        </a>
        {/* Hamburguesa */}
        <button onClick={() => setMenuOpen(v => !v)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-[#e0d9cc] transition-colors">
          <span className={`w-5 h-px bg-[#1f3a5f] transition-all duration-300 ${menuOpen?"rotate-45 translate-y-[7px]":""}`} />
          <span className={`w-5 h-px bg-[#1f3a5f] transition-all duration-300 ${menuOpen?"opacity-0":""}`} />
          <span className={`w-5 h-px bg-[#1f3a5f] transition-all duration-300 ${menuOpen?"-rotate-45 -translate-y-[7px]":""}`} />
        </button>
      </nav>

      {/* Menú desplegable móvil */}
      <div className={`fixed top-[57px] left-0 right-0 z-30 bg-[#f5f1e8]/95 backdrop-blur-md border-b border-[#e0d9cc] transition-all duration-300 overflow-hidden ${menuOpen?"max-h-60 py-4":"max-h-0"}`}>
        <div className="flex flex-col items-center gap-5 px-6">
          <button onClick={scrollToCatalog} className="text-xs tracking-widest uppercase text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Catálogo</button>
          <a href="#nosotros" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Nosotros</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)} className="text-xs tracking-widest uppercase text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Contacto</a>
          <a href={`https://www.instagram.com/${IG_USER}`} target="_blank" rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase text-[#1f3a5f] flex items-center gap-2" style={{ fontFamily:"var(--font-body,sans-serif)" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <defs><linearGradient id="igm" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/>
              </linearGradient></defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#igm)" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="4" stroke="url(#igm)" strokeWidth="2" fill="none"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igm)"/>
            </svg>
            Instagram
          </a>
        </div>
      </div>

      {/* HERO MÓVIL */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16 overflow-hidden">
        {/* Partículas reducidas en móvil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[{s:2,x:15,y:25,d:0,dur:8},{s:2,x:80,y:15,d:1.5,dur:10},{s:3,x:85,y:70,d:0.4,dur:7},{s:2,x:20,y:75,d:2,dur:9}].map((p,i) => (
            <div key={i} className="absolute rounded-full bg-[#1f3a5f]"
              style={{width:p.s,height:p.s,left:`${p.x}%`,top:`${p.y}%`,animation:`floatUp ${p.dur}s ease-in-out ${p.d}s infinite`}} />
          ))}
          <div className="absolute border border-[#1f3a5f]/10 rounded-full"
            style={{width:260,height:260,left:"50%",top:"50%",marginLeft:-130,marginTop:-130,animation:"spinSlow 30s linear infinite"}} />
        </div>

        <div className="absolute w-64 h-64 rounded-full bg-[#d4c9a8]/25 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-[#1f3a5f]/8 scale-125 blur-xl" />
          <Image src="/logo.png" alt="Aslé Joyería" width={150} height={150} className="relative drop-shadow-xl" />
        </div>

        <p className="text-[10px] tracking-[0.4em] uppercase text-[#8a7a60] mb-3" style={{ fontFamily:"var(--font-body,sans-serif)" }}>
          Joyería artesanal
        </p>
        <p className="text-[#7a8fa6] max-w-xs text-sm leading-relaxed" style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:300 }}>
          Elegancia que perdura. Diseños hechos para resaltar tu esencia.
        </p>

        <button onClick={scrollToCatalog}
          className="mt-8 px-7 py-3 bg-[#1f3a5f] text-white rounded-full hover:bg-[#162a45] active:scale-95 transition-all duration-200 shadow-lg shadow-[#1f3a5f]/20 tracking-widest uppercase text-xs"
          style={{ fontFamily:"var(--font-body,sans-serif)", fontWeight:500 }}>Ver catálogo</button>

        {/* Card Instagram inline en móvil */}
        <a href={`https://www.instagram.com/${IG_USER}`} target="_blank" rel="noopener noreferrer"
          className="mt-8 flex items-center gap-3 bg-white/70 backdrop-blur px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-[#e0d9cc]">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#ede9df] flex-shrink-0">
            <Image src="/foto_instagram.jpg" alt="Instagram" fill className="object-cover"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display="none"; }} />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-gray-400" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Instagram</p>
            <p className="text-xs font-semibold text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>@asle_joyeria</p>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="ml-1">
            <defs><linearGradient id="igc" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/>
            </linearGradient></defs>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#igc)" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="4" stroke="url(#igc)" strokeWidth="2" fill="none"/>
            <circle cx="17.5" cy="6.5" r="1.2" fill="url(#igc)"/>
          </svg>
        </a>

        <div className="absolute bottom-8 flex flex-col items-center gap-1 animate-bounce opacity-30">
          <div className="w-px h-6 bg-[#1f3a5f]" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-[#1f3a5f]" style={{ fontFamily:"var(--font-body,sans-serif)" }}>scroll</span>
        </div>
      </section>

      <ValorSection />

      {/* CATÁLOGO MÓVIL — 1 columna */}
      <section ref={catalogRef} className="py-16 px-4 bg-[#f5f1e8]">
        <div className="max-w-md mx-auto">
          <p className="text-center text-xs tracking-[0.4em] uppercase text-[#8a7a60] mb-3" style={{ fontFamily:"var(--font-body,sans-serif)" }}>Colección</p>
          <h2 className="text-center text-3xl text-[#1f3a5f] mb-10" style={{ fontFamily:"var(--font-display,serif)", fontWeight:600 }}>Catálogo</h2>
          <div className="flex flex-col gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onDetail={() => setSelectedProduct(p)} />)}
          </div>
        </div>
      </section>

      <ContactoSection />
      <FooterSection />
    </main>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Home() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}