import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronUp, Clock, BookOpen, CheckCircle2, AlertCircle } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { staggerContainer, fadeInUp } from "../../utils/animations";

const blogPosts = [
  {
    id: "fibrillation-auriculaire",
    category: "Cardiologie",
    date: "1 août 2026",
    readTime: "4 min",
    title: "Comprendre la Fibrillation Auriculaire",
    excerpt: "La FA touche plus de 33 millions de personnes dans le monde. Quels sont les signes précurseurs et comment préserver votre cœur au quotidien ?",
    content: {
      intro: "La fibrillation auriculaire (FA) est le trouble du rythme cardiaque le plus fréquemment rencontré en pratique clinique. Elle se caractérise par des battements désordonnés et souvent trop rapides des oreillettes du cœur.",
      sections: [
        {
          heading: "Les symptômes révélateurs",
          paragraphs: [
            "Bien que certains patients demeurent totalement asymptomatiques, plusieurs signes typiques doivent inciter à consulter sans délai :",
          ],
          points: [
            "Palpitations subites ou sensation de battements irréguliers dans la poitrine.",
            "Essoufflement anormal lors d'efforts modestes ou même au repos.",
            "Fatigue chronique inexpliquée et baisse d'endurance physique.",
            "Étourdissements, vertiges ou sensation de malaise passager."
          ]
        },
        {
          heading: "Pourquoi un diagnostic précoce est essentiel ?",
          paragraphs: [
            "En présence d'une FA non contrôlée, le sang stagne dans les cavités cardiaques supérieures, favorisant la formation de caillots sanguins. Sans prise en charge adéquate, le risque d'accident vasculaire cérébral (AVC) est multiplié par cinq.",
            "Un simple enregistrement électrocardiographique (ECG) ou un Holter permet d'établir un diagnostic précis et de démarrer un traitement protecteur adapté (anticoagulants, antiarythmiques ou ablation)."
          ]
        }
      ],
      doctorTip: "Évitez les stimulants excessifs (caféine concentrée, boissons énergisantes, alcool et tabac) et surveillez régulièrement votre pouls. Un pouls normal au repos bat généralement entre 60 et 100 pulsations par minute de façon régulière."
    }
  },
  {
    id: "sante-cardiaque-apres-40",
    category: "Prévention",
    date: "18 juillet 2026",
    readTime: "3 min",
    title: "Santé Cardiaque Après 40 Ans",
    excerpt: "Des modifications simples et prouvées du mode de vie qui permettent de renforcer durablement le muscle cardiaque et les artères.",
    content: {
      intro: "À partir de 40 ans, les parois artérielles perdent progressivement en souplesse et le métabolisme lipidique évolue. C'est le moment charnière pour adopter une stratégie préventive efficace.",
      sections: [
        {
          heading: "Les 4 piliers de la protection cardiovasculaire",
          paragraphs: [
            "La recherche médicale confirme qu'agir sur quelques habitudes clés réduit de plus de 70% le risque d'accident coronarien :"
          ],
          points: [
            "Activité aérobie régulière : 150 minutes d'exercice d'endurance modérée par semaine (marche rapide, natation, vélo).",
            "Régime méditerranéen : privilégiez les acides gras oméga-3 (poissons gras, huile d'olive vierge, noix) et les antioxydants.",
            "Gestion du stress & sommeil : 7 à 8 heures de repos nocturne de qualité pour réguler la sécrétion de cortisol.",
            "Suivi de la tension : maintenir une pression artérielle en dessous de 130/80 mmHg."
          ]
        },
        {
          heading: "Le bilan cardiologique périodique",
          paragraphs: [
            "Un bilan sanguin complet (cholestérol LDL, triglycérides, glycémie à jeun) associé à un examen clinique avec votre cardiologue permet d'identifier les facteurs de risque silencieux avant l'apparition du moindre symptôme."
          ]
        }
      ],
      doctorTip: "Planifiez un électrocardiogramme de repos de référence dès 40 ans, en particulier en cas d'antécédents familiaux de pathologies cardiovasculaires."
    }
  }
];

export function BlogSection() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="bg-white px-5 py-12 w-full"
    >
      <motion.div variants={fadeInUp}>
        <SectionHeader subtitle="Actualités santé" title="Le Blog" />
      </motion.div>
      <div className="mt-8 flex flex-col gap-4">
        {blogPosts.map((post) => {
          const isExpanded = expandedId === post.id;

          return (
            <motion.article 
              key={post.id} 
              layout
              variants={fadeInUp}
              transition={{ layout: { duration: 0.35, ease: "easeInOut" } }}
              onClick={() => toggleExpand(post.id)}
              className={`bg-white p-5 rounded-[22px] border-[0.667px] transition-all cursor-pointer ${
                isExpanded 
                  ? "border-[#4682b4] shadow-[0px_8px_24px_rgba(70,130,180,0.18)]" 
                  : "border-[#4682b4] drop-shadow-[0px_2px_7px_rgba(70,130,180,0.1)] hover:border-[#3b6d96] hover:-translate-y-0.5"
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#4682b4] text-[11px] bg-[rgba(70,130,180,0.08)] px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[11px] text-[rgba(70,130,180,0.6)] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#4682b4]" />
                    {post.readTime}
                  </span>
                </div>
                <span className="text-[11px] text-[rgba(70,130,180,0.55)]">{post.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-['Poppins'] font-semibold text-[15px] text-[#4682b4] mb-2 leading-snug">
                {post.title}
              </h3>

              {/* Excerpt (hidden when expanded) */}
              {!isExpanded && (
                <p className="text-[13px] text-[rgba(70,130,180,0.65)] mb-4 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Expanded Rich Article Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 pb-4 text-[#334155] border-t border-[#4682b420] mt-3 flex flex-col gap-4">
                      {/* Intro Lead */}
                      <p className="text-[13px] leading-relaxed text-[#4682b4] bg-[#4682b40a] p-3.5 rounded-[14px] border border-[#4682b42e]">
                        {post.content.intro}
                      </p>

                      {/* Sections */}
                      {post.content.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="flex flex-col gap-2">
                          <h4 className="font-semibold text-[#4682b4] text-[13.5px] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#4682b4]" />
                            {sec.heading}
                          </h4>
                          {sec.paragraphs.map((p, pIdx) => (
                            <p key={pIdx} className="text-[12.5px] text-[rgba(70,130,180,0.85)] leading-relaxed">
                              {p}
                            </p>
                          ))}
                          {sec.points && (
                            <ul className="flex flex-col gap-1.5 mt-1 pl-1">
                              {sec.points.map((pt, ptIdx) => (
                                <li key={ptIdx} className="text-[12px] text-[rgba(70,130,180,0.85)] flex items-start gap-2 leading-relaxed">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4682b4] shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                      {/* Doctor advice highlight */}
                      {post.content.doctorTip && (
                        <div className="bg-[#4682b412] p-3.5 rounded-[14px] border border-[#4682b425] flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-[#4682b4] shrink-0 mt-0.5" />
                          <div className="text-[12px] text-[#4682b4] leading-relaxed">
                            <span className="font-semibold block mb-0.5">Le conseil du médecin :</span>
                            <span className="text-[rgba(70,130,180,0.85)]">{post.content.doctorTip}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button / Toggle Footer */}
              <div className="flex items-center justify-between pt-1">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(post.id);
                  }}
                  className="text-[13px] font-semibold text-[#4682b4] flex items-center gap-1.5 hover:gap-2 transition-all"
                >
                  {isExpanded ? (
                    <>
                      Réduire l'article <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Lire la suite <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {isExpanded && (
                  <span className="text-[11px] text-[rgba(70,130,180,0.5)] font-medium">
                    Cliquez pour fermer
                  </span>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

