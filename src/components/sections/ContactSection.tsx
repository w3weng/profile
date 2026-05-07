import { motion } from 'framer-motion'
import { AtSign, Camera, GitBranch, MessageCircle, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SITE } from '../../constants/site'
import { submitContactMessage } from '../../lib/cms'
import { Button } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { ResumeActions } from '../resume/ResumeActions'
import { toast } from '../ui/Toaster'

type FormState = { name: string; email: string; message: string }

export function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const socials = useMemo(
    () => [
      { label: 'Facebook', href: SITE.socials.facebook, icon: MessageCircle },
      { label: 'GitHub', href: SITE.socials.github, icon: GitBranch },
      { label: 'Instagram', href: SITE.socials.instagram, icon: Camera },
      { label: 'Email', href: `mailto:${SITE.email}`, icon: AtSign },
    ],
    [],
  )

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    try {
      setStatus('sending')
      await submitContactMessage(form)
      setStatus('sent')
      toast.success('Message sent successfully.')
      setTimeout(() => setStatus('idle'), 2200)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('idle')
      toast.error('Unable to send message right now.')
    }
  }

  return (
    <section id="contact" className="container-pad py-16 sm:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Let’s build something clean and powerful."
        description="Have an idea, a system to improve, or a project to collaborate on? Send a message—I'm happy to connect."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          onSubmit={onSubmit}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-zinc-300">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-xs text-zinc-300">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
                placeholder="you@email.com"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-xs text-zinc-300">Message</span>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-white/20 focus:bg-white/[0.05]"
              placeholder="Tell me what you’re building…"
            />
          </label>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-zinc-400">
              Prefer email?{' '}
              <a className="text-zinc-200 hover:text-white" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
            <Button type="submit" disabled={status === 'sending'}>
              {status === 'sent' ? (
                'Message queued'
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </Button>
            <ResumeActions compact />
          </div>
        </motion.form>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            <p className="text-sm font-semibold text-zinc-50">Socials</p>
            <p className="mt-2 text-sm text-zinc-300">
              Reach out on your preferred platform. I respond fastest on GitHub and email.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass glass-hover inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-zinc-100"
                >
                  <s.icon className="h-4 w-4 text-glow-cyan" />
                  {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Floating social icons (desktop) */}
          <div className="hidden lg:block">
            <div className="glass rounded-2xl p-4">
              <p className="text-xs font-medium text-zinc-50">Quick links</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-zinc-100 transition hover:border-white/20 hover:bg-white/[0.06]"
                    aria-label={s.label}
                    title={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

