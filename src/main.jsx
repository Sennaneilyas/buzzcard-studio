import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data window
      gcTime: 1000 * 60 * 15,    // 15 minutes garbage collection window
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const root = createRoot(document.getElementById('root'))
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  root.render(
    <StrictMode>
      <main className="flex min-h-screen items-center justify-center bg-cloud px-6 font-sans text-navy">
        <section className="w-full max-w-lg rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy/45">
            Development configuration
          </p>
          <h1 className="mt-3 text-2xl font-extrabold">Supabase configuration is missing</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/65">
            Create <code className="font-bold">.env.local</code>, add the public project URL and anon key, then restart Vite.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-navy p-4 text-xs leading-6 text-white">
            VITE_SUPABASE_URL=https://your-project.supabase.co{"\n"}
            VITE_SUPABASE_ANON_KEY=your-public-anon-key
          </pre>
        </section>
      </main>
    </StrictMode>,
  )
} else {
  Promise.all([
    import('@/features/auth'),
    import('./App.jsx'),
  ]).then(([{ AuthProvider }, { default: App }]) => {
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>,
    )
  }).catch((error) => {
    console.error('BuzzCard failed to start:', error)
    root.render(
      <StrictMode>
        <main className="flex min-h-screen items-center justify-center bg-cloud px-6 font-sans text-navy">
          <section className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold">BuzzCard could not start</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Reload the page. If the problem continues, check the development console for the blocked module.
            </p>
          </section>
        </main>
      </StrictMode>,
    )
  })
}
