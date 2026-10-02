import { WalletButton } from "@/components/Providers";
import Link from "next/link";
import { Shield, Zap, Users, Clock, ArrowRight, Lock, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Dead man's switch",
    desc: "El testamento se marca como ejecutable cuando la cadena demuestra que pasaron N días sin un heartbeat tuyo. Un keeper cualquiera lo dispara: no depende de que vos estés vivo ni de que nadie coopere.",
  },
  {
    icon: Zap,
    title: "Reglas condicionales",
    desc: "Inactividad y fecha son las reglas que esta versión implementa y evalúa en cadena. Los tipos de precio y rebalance existen en el modelo de datos pero todavía no se evalúan.",
  },
  {
    icon: Users,
    title: "Herencia por wallet",
    desc: "Cada heredero tiene un porcentaje fijo y una wallet. El reclamo mueve tokens reales desde una token account controlada por una PDA, sin intermediarios.",
  },
  {
    icon: Clock,
    title: "Sin valuación en cadena",
    desc: "El vault guarda cantidades reales de cada mint, no un valor en dólares. Un basket no se puede precio honestamente on-chain, y un número guardado sería mentira.",
  },
];

const steps = [
  { num: "01", title: "Conectá wallet", desc: "Phantom, Backpack, Solflare o Ledger." },
  { num: "02", title: "Definí reglas y herederos", desc: "Inactividad, fecha, porcentajes que suman 100%." },
  { num: "03", title: "Depositás los assets", desc: "Registrás el mint y movés tokens a la vault." },
  { num: "04", title: "Heartbeat o reclamo", desc: "Vos firmás para seguir vivo, o el keeper ejecuta y los herederos cobran." },
];

const notYet = [
  "Oracles de precio (Pyth / Switchboard): removidos de las dependencias, sin implementar.",
  "Rebalanceo automático y conversión a stablecoins: no implementado.",
  "SBTs heredables y verificación biométrica WebAuthn: no implementado.",
  "Liquidación de acciones, CEDEARs o bonos tokenizados: el vault solo maneja SPL tokens.",
  "Deploy a devnet o mainnet: el programa todavía no compiló ni se desplegó.",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-accent" />
            <span className="font-heading text-xl font-bold text-foreground">LegacyLedger</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#que-es" className="text-muted hover:text-foreground transition-colors">
              Qué es
            </a>
            <a href="#como-funciona" className="text-muted hover:text-foreground transition-colors">
              Cómo funciona
            </a>
            <a href="#estado" className="text-muted hover:text-foreground transition-colors">
              Estado
            </a>
            <WalletButton />
          </div>
        </nav>
      </header>

      <main className="pt-16">
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-medium text-accent">En construcción - no desplegado</span>
            </div>

            <h1 className="font-heading text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Testamentos <span className="text-accent">programables</span> on-chain
            </h1>
            <p className="text-xl lg:text-2xl text-muted mb-10 text-balance">
              Dejás reglas de salida para tus activos. Si dejás de firmar, la cadena lo demuestra
              y alguien dispara la distribución a tus herederos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/create" className="btn-primary text-lg px-8 py-4">
                Crear testamento
                <ArrowRight className="ml-2 h-5 w-5 inline-block" />
              </Link>
              <a href="#estado" className="btn-secondary text-lg px-8 py-4">
                Qué funciona y qué no
              </a>
            </div>
          </div>
        </section>

        <section id="que-es" className="py-20 bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Qué hace hoy
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                Cuatro cosas, y nada más.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="card-base">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Cómo funciona
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-4 md:left-0 top-0 text-6xl lg:text-7xl font-heading font-bold text-accent/10">
                    {step.num}
                  </div>
                  <div className="relative pl-4 md:pl-0 border-l-2 border-accent/20 ml-4 md:ml-0 pt-2 md:pt-12 pb-8 last:pb-0 last:border-0">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="estado" className="py-20 bg-card/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4 mb-8">
              <AlertTriangle className="h-7 w-7 text-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  Lo que todavía no existe
                </h2>
                <p className="text-muted mt-2">
                  Está en la lista porque el pitch original las prometía. No andan.
                </p>
              </div>
            </div>

            <ul className="space-y-3">
              {notYet.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted">
                  <Lock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
              Esto no es asesoramiento legal ni financiero
            </h2>
            <p className="text-muted">
              Automatizar una sucesión tiene consecuencias de derecho. Que el código distribuya
              tokens no hace válido un testamento, ni reemplaza un escribano, ni el fallo de un
              judge. Eso requiere opinión legal en cada jurisdicción donde operes.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-accent" />
            <span className="font-heading text-lg font-bold">LegacyLedger</span>
          </div>
          <p className="text-sm text-muted">
            Programa Anchor sobre Solana. En desarrollo, sin desplegar.
          </p>
        </div>
      </footer>
    </div>
  );
}
