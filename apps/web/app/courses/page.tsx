export default function CoursesPage() {
  const courses = [
    {
      id: "1",
      title: "Principles of Quantum Machine Learning",
      difficulty: "Advanced",
      duration: "12h Left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvKXPAa4ts3MFeibTMvkuFqp3llK8kzkn9Uf0RSyxiEaXE5SR6e692X8_mnUzjLeKPX-FFDK8qZZ0IwYj9elHyTXfiHvBy8rz1TP2HaPpA6v1ybtvpmjG-ScjBhrtYOFmvHHDxCFk_cX6nq4KGCckB8JN3c5QWdFMXVTRnCGIBqDBvf1A6-ogPhP2icHRIuywuHiCGtGMH5FyiQkG5GjbaPdG_GtBi4372ckFttlGMEqmBBMTEJZUsQDodT1Y1whNBaMpVkYS2_so",
      badge: "AI Certified"
    },
    {
      id: "2",
      title: "Ethical Hacking: The AI Frontier",
      difficulty: "Intermediate",
      duration: "8h Left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQlYEThjM42oE1wXXX9ypPpdcOSFPnO0ccyzGrbtKYnzFScfc82BvXcHcB-Isj5h-y6d4mM8wK-cz8QhrFIU8MipAdRWGivXkNJ2_HWbFZIRZkoxkqWNp83xdFxP7wJ_19LEXBLWYzuvIiR9EgZPuohDXMNcv-sgfWaYESNEBS8HbruVDqYuzs8fMYE4_EnaSZE_uzv-XI7Gqe_GH_7vMRCcqT--GNTuWJDNqpSxN4QrwVWheBBLfRDXyqZeVoYZV6tS3h9-3qgZ8",
      badge: "New Updates"
    },
    {
      id: "3",
      title: "Astrophysics Basics",
      difficulty: "Beginner",
      duration: "20h Left",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaCqq9J6AtCt86DncV2QWuQ1b4e4rluvPVRS4CVXenVZkMNXGDjlD_nB6bufAeuv21MIJolbn1oCFNq4MpLUPABG2v-gw0aFSgWiGIpDixQSGLqmkBN4F7DZZ-7D38K-fT1nASL5ZyJfmgUZE0xEbq4PBF1BdUxvGpRWhqYGyIaG2T-HAVERG1inLItZv1xxaqnWf4YV8L-z8aj9Y3UoSIkKT69h12vURxlxVeX4RVLHhaoF5Frwn2H6egrZek6Yn0XdQMpUuPXBA",
      badge: "AI Recommended"
    }
  ];

  return (
    <div className="bg-surface min-h-screen pt-24 px-8 pb-12 max-w-7xl mx-auto font-body">
      <header className="mb-12">
        <h1 className="text-4xl font-headline font-black text-primary mb-4">Course Catalog</h1>
        <p className="text-on-surface-variant text-lg">Explroe our curated selection of AI-powered courses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="group bg-white rounded-2xl p-4 transition-all hover:translate-y-[-4px] hover:shadow-lg border border-outline-variant/10 cursor-pointer">
            <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
              <img alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={course.image} />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-black uppercase text-primary">{course.badge}</div>
            </div>
            <h4 className="font-headline font-bold text-lg text-primary mb-1">{course.title}</h4>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {course.duration}</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">trending_up</span> {course.difficulty}</span>
            </div>
            <button className="w-full py-3 bg-surface-container text-primary font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all">
              View Syllabus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
