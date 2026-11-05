import { BookOpen, Lightbulb, Pencil } from 'lucide-react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import Navbar from '../components/Navbar'
import PageDots from '../components/PageDots'
import { modules } from '../data'
import { useAuth } from '../hooks/useAuth'
import { useInView } from '../hooks/useInView'

const steps = [
  {
    icon: BookOpen,
    title: 'Read a little',
    text: 'One concept per lesson, explained in a few short paragraphs.',
    dur: '4s',
    lag: '0s',
  },
  {
    icon: Pencil,
    title: 'Write real code',
    text: 'Edit the code beside the lesson and watch the preview update.',
    dur: '4s',
    lag: '0s',
  },
  {
    icon: Lightbulb,
    title: 'Get unstuck',
    text: 'Check your work and unlock hints one at a time.',
    dur: '4s',
    lag: '0s',
  },
]

/* Sets the start delay read by the .rise and .slide-in animations. */
const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
const drift = (dur: string, lag: string) => ({ '--dur': dur, '--fd': lag }) as CSSProperties

/* Fades all four edges of the image into the page, so there is no box. */
const FEATHER =
  'linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)'

export default function LandingPage() {
  const { user } = useAuth()
  const { ref: stepsRef, seen: stepsSeen } = useInView<HTMLElement>()

  const free = modules
    .flatMap((mod) => mod.lessons.map((lesson) => ({ mod, lesson })))
    .find(({ lesson }) => lesson.free)
  const freePath = free ? `/learn/${free.mod.id}/${free.lesson.id}` : '/signup'

  return (
    <div className="relative min-h-screen">
      <PageDots />

      {/* Content sits above the dots. */}
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6">
          <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
            {/* Text side: each piece rises in one after the other. */}
            <div className="text-center lg:text-left">
              <h1
                className="rise text-4xl font-semibold tracking-tight text-fg md:text-5xl"
                style={delay(0)}
              >
                Learn web development by building, not just reading.
              </h1>
              <p
                className="rise mx-auto mt-5 max-w-xl text-lg leading-8 text-muted lg:mx-0"
                style={delay(120)}
              >
                Short lessons in HTML, CSS and JavaScript. Every lesson ends with a hands-on
                challenge, instant feedback, and hints that nudge you instead of giving the answer
                away.
              </p>
              <div
                className="rise mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
                style={delay(240)}
              >
                <Link to={freePath} className="btn-primary px-5 py-2.5">
                  Try a free lesson
                </Link>
                <Link to={user ? '/dashboard' : '/signup'} className="btn-outline px-5 py-2.5">
                  {user ? 'Go to dashboard' : 'Create account'}
                </Link>
              </div>
              <p className="rise mt-6 font-display text-sm text-muted" style={delay(360)}>
                {modules.map((m) => m.title).join('  ·  ')}
              </p>
            </div>

            {/* Image side: slides in, then floats. The edges dissolve into the page. */}
            <div className="slide-in relative" style={delay(350)}>
              <div
                aria-hidden="true"
                className="absolute inset-6 -z-10 rounded-full bg-accent/20 blur-3xl"
              />
              <div className="float">
                <div
                  className="aspect-[2/1]"
                  style={{
                    transform: 'perspective(1200px) rotateX(8deg)',
                    maskImage: FEATHER,
                    WebkitMaskImage: FEATHER,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                  }}
                >
                  <img
                    src={heroImage}
                    alt="A DevLearn lesson window. HTML code is on the left and the live preview it produces is on the right."
                    width={1280}
                    height={720}
                    fetchPriority="high"
                    decoding="async"
                    className="hero-image h-full w-full object-cover"
                    style={{ objectPosition: 'center 48%' }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Steps: slanted cards that fade up when scrolled into view, then keep floating. */}
          <section ref={stepsRef} className="grid gap-6 pb-24 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text, dur, lag }, index) => (
              <div
                key={title}
                style={{ transitionDelay: `${index * 140}ms` }}
                className={`transition duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${stepsSeen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  } ${index === 1 ? 'md:mt-10' : ''}`}
              >
                <div className="float" style={drift(dur, lag)}>
                  <div className="-skew-x-6 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent">
                    {/* Skewed back the other way so the text stays upright. */}
                    <div className="flex skew-x-6 items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-fg">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}