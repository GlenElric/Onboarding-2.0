import './globals.css';

export default function Home() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 z-50 w-full bg-white dark:bg-slate-950 flex justify-between items-center h-16 px-8 border-b border-slate-200 dark:border-slate-800 shadow-sm font-headline tracking-tight">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">Aura Learning</span>
          <nav className="hidden md:flex gap-6">
            <a className="text-indigo-900 dark:text-teal-400 border-b-2 border-indigo-900 dark:border-teal-400 pb-1 duration-200 ease-in-out" href="#">Dashboard</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-700 dark:hover:text-teal-300 transition-colors duration-200 ease-in-out" href="#">Courses</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-700 dark:hover:text-teal-300 transition-colors duration-200 ease-in-out" href="#">Community</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-indigo-700 dark:hover:text-teal-300 transition-colors duration-200 ease-in-out" href="#">Reports</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">Upgrade Plan</button>
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-slate-500 cursor-pointer p-2 hover:bg-surface-container rounded-full">notifications</span>
            <span className="material-symbols-outlined text-slate-500 cursor-pointer p-2 hover:bg-surface-container rounded-full">help_outline</span>
          </div>
          <img alt="User profile" className="w-8 h-8 rounded-full object-cover border border-outline-variant/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFF7bLX3RwtUIQjSzezGWJ3TMUqTUu7LbH9gknkeAAK65HGOe7NHIRhS_jt36gkSCcdgoL8J__XujzgzvfNThraBkVqEcfZNy_Vwirm26mpovkJSoS_Zpm632-ICukFwToJzQ0knma3xcJY-oBVKB9QP2EjVG0dOYO-Gpg3zBEtDKoZmwHq3gDSMYkGaCSpjuDC82L1gpCQqOG4B4eLFWE5WePb6jkfiI3fV_sPvIHjZq-hfbcb3uBkWsveURHFCOk7LOSmwOotB4" />
        </div>
      </header>

      {/* SideNavBar (Mobile Bottom / Desktop Left) */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 pt-20 flex-col p-4 gap-2 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 font-headline text-sm">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <div>
              <div className="text-xl font-bold text-indigo-950 dark:text-white">Cognitive Corp</div>
              <div className="text-xs text-slate-500">Enterprise Tier</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2 text-indigo-900 dark:text-teal-300 font-bold bg-white dark:bg-slate-800 rounded-lg shadow-sm transition-all" href="#">
            <span className="material-symbols-outlined">dashboard</span> Home
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">auto_stories</span> My Learning
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">edit_note</span> Course Builder
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">insights</span> Analytics
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">group</span> Team Management
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">settings</span> Settings
          </a>
        </nav>
        <div className="p-4 bg-indigo-950 rounded-xl mb-4">
          <p className="text-indigo-200 text-xs mb-3">Stuck on a concept?</p>
          <button className="w-full bg-secondary-container text-secondary py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all scale-95 active:scale-100">
            <span className="material-symbols-outlined text-sm">smart_toy</span> Ask AI Tutor
          </button>
        </div>
        <div className="pt-4 border-t border-slate-200">
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:translate-x-1 transition-all" href="#">
            <span className="material-symbols-outlined">contact_support</span> Support
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:translate-x-1 transition-all" href="#">
            <span className="material-symbols-outlined">logout</span> Log Out
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-24 px-8 pb-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="label-md font-label uppercase tracking-widest text-secondary font-bold mb-2 block">Welcome back, Sarah</span>
            <h1 className="text-5xl font-headline font-extrabold text-primary tracking-tight leading-tight">Master your focus today.</h1>
            <p className="text-on-surface-variant mt-4 text-lg max-w-md">You're in the top 5% of learners this week. Your personalized AI learning path is ready for the next module.</p>
          </div>
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm min-w-[160px]">
              <div className="flex items-center gap-2 text-secondary mb-2">
                <span className="material-symbols-outlined">timer</span>
                <span className="text-xs font-bold uppercase tracking-wider">Total Time</span>
              </div>
              <div className="text-2xl font-headline font-extrabold text-primary">124h <span className="text-sm font-normal text-on-surface-variant">32m</span></div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 shadow-sm min-w-[160px]">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <span className="material-symbols-outlined">star</span>
                <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
              </div>
              <div className="text-2xl font-headline font-extrabold text-primary">94.2<span className="text-sm font-normal text-on-surface-variant">%</span></div>
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Continue Learning Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-primary">Continue Learning</h2>
                <button className="text-secondary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View Schedule <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className="relative group overflow-hidden rounded-2xl bg-primary-container p-8 text-on-primary">
                <div className="absolute right-0 bottom-0 opacity-10">
                  <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">Active Module</span>
                    <span className="text-indigo-200 text-sm italic">45 mins remaining</span>
                  </div>
                  <h3 className="text-3xl font-headline font-bold mb-6">Advanced Cognitive Architectures in Neural Networks</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-medium">Module Completion</span>
                      <span className="font-bold">78%</span>
                    </div>
                    <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                      <div className="bg-secondary-fixed h-full rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button className="bg-white text-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                        <span className="material-symbols-outlined">play_arrow</span> Resume Lesson
                      </button>
                      <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-all">
                        Lab Materials
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* My Courses Gallery */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-primary">My Courses</h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-sm font-medium cursor-pointer hover:bg-surface-container transition-all">All</span>
                  <span className="px-4 py-2 bg-white text-primary font-bold rounded-full text-sm shadow-sm cursor-pointer border border-outline-variant/10">In Progress</span>
                  <span className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-sm font-medium cursor-pointer hover:bg-surface-container transition-all">Completed</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Card 1 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-4 transition-all hover:translate-y-[-4px] hover:shadow-lg border border-outline-variant/5">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                    <img alt="Quantum Computing" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKXPAa4ts3MFeibTMvkuFqp3llK8kzkn9Uf0RSyxiEaXE5SR6e692X8_mnUzjLeKPX-FFDK8qZZ0IwYj9elHyTXfiHvBy8rz1TP2HaPpA6v1ybtvpmjG-ScjBhrtYOFmvHHDxCFk_cX6nq4KGCckB8JN3c5QWdFMXVTRnCGIBqDBvf1A6-ogPhP2icHRIuywuHiCGtGMH5FyiQkG5GjbaPdG_GtBi4372ckFttlGMEqmBBMTEJZUsQDodT1Y1whNBaMpVkYS2_so" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-black uppercase text-primary">AI Certified</div>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-primary mb-1">Principles of Quantum Machine Learning</h4>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 12h Left</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> Advanced</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full mb-4">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                {/* Course Card 2 */}
                <div className="group bg-surface-container-lowest rounded-2xl p-4 transition-all hover:translate-y-[-4px] hover:shadow-lg border border-outline-variant/5">
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                    <img alt="Cybersecurity" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQlYEThjM42oE1wXXX9ypPpdcOSFPnO0ccyzGrbtKYnzFScfc82BvXcHcB-Isj5h-y6d4mM8wK-cz8QhrFIU8MipAdRWGivXkNJ2_HWbFZIRZkoxkqWNp83xdFxP7wJ_19LEXBLWYzuvIiR9EgZPuohDXMNcv-sgfWaYESNEBS8HbruVDqYuzs8fMYE4_EnaSZE_uzv-XI7Gqe_GH_7vMRCcqT--GNTuWJDNqpSxN4QrwVWheBBLfRDXyqZeVoYZV6tS3h9-3qgZ8" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-black uppercase text-primary">New Updates</div>
                  </div>
                  <h4 className="font-headline font-bold text-lg text-primary mb-1">Ethical Hacking: The AI Frontier</h4>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 8h Left</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> Intermediate</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full mb-4">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* Side Sidebar (Right Column) */}
          <div className="lg:col-span-4 space-y-8">
            {/* AI Insights Panel */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-container rounded-full blur-[60px] opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest text-secondary">AI Insights</span>
                </div>
                <h3 className="font-headline font-bold text-primary mb-3">Study Pattern Alert</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  Your retention is 20% higher when you study between 8 AM and 10 AM. Would you like to schedule your "Quantum Physics" block for tomorrow morning?
                </p>
                <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm shadow-md hover:translate-y-[-2px] transition-all">
                  Optimize Schedule
                </button>
              </div>
            </div>
            {/* Recent Activity */}
            <section>
              <h2 className="text-xl font-headline font-bold text-primary mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {/* Activity Item 1 */}
                <div className="flex gap-4 p-4 bg-surface-container-low rounded-xl transition-all hover:bg-surface-container-high cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-teal-700" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">Completed Quiz: Data Structures</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Score: 98/100 • 2 hours ago</p>
                  </div>
                </div>
                {/* Activity Item 2 */}
                <div className="flex gap-4 p-4 bg-surface-container-low rounded-xl transition-all hover:bg-surface-container-high cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-indigo-700">forum</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">Chat with AI Tutor</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Topic: Recursive Algorithms • 5 hours ago</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-on-surface-variant text-xs font-semibold hover:text-primary transition-all">
                Show More Activity
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* FAB for AI Tutor */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">smart_toy</span>
        <div className="absolute -top-12 right-0 bg-white px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
          Ask AI Tutor
        </div>
      </button>
    </div>
  );
}
