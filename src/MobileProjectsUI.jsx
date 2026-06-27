import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 👈 අපේ Supabase Client එක මෙතනට සම්බන්ධ කලා

// 📱 MOBILE APP UI COMPONENT (🌟 100% CLEAN PREMIUM ANIMATED VERSION)
export default function MobileProjectsUI({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Supabase Cloud එකෙන් සජීවීව ප්‍රොජෙක්ට්ස් ඇසට්ස් ටික ලබා ගැනීම
  useEffect(() => {
    const fetchMobileUIProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Error loading smartphone items:", error);
      } else if (data) {
        // 🔄 ඩේටාබේස් fields ටික ඔයාගේ ඔරිජිනල් UI ලූප් එකේ ප්‍රොපටීස් වලට මැප් කිරීම
        const mappedData = data.map(p => ({
          id: p.id,
          title: p.title,
          desc: p.summary ? (p.summary.length > 85 ? p.summary.substring(0, 85) + "..." : p.summary) : '',
          img: p.image_path,
          tech: p.tags && p.tags.length > 0 ? p.tags.join(' & ') : 'WebGL Dev',
          // 3D Swiper එකට අත්‍යවශ්‍ය වන අමතර ලිංක්ස්
          video: p.video_path,
          url: p.live_link
        }));
        setProjects(mappedData);
      }
      setLoading(false);
    };

    fetchMobileUIProjects();
  }, []);

  // ⏳ ෆෝන් එක ඇතුලත පේන කුඩා ස්මාර්ට් ලෝඩර් එක
  if (loading) {
    return (
      <div style={{
        width: '320px', height: '620px', backgroundColor: '#05050d',
        borderRadius: '36px', overflow: 'hidden', border: '6px solid #111',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', fontFamily: 'monospace', color: '#00ffff'
      }}>
        <div style={{ fontSize: '12px', letterSpacing: '2px', animation: 'pulse 1s infinite' }}>📥 PORTFOLIO_OS...</div>
      </div>
    );
  }

  return (
    <div style={{
      width: '320px', height: '620px', backgroundColor: '#05050d',
      borderRadius: '36px', overflow: 'hidden', border: '6px solid #111',
      fontFamily: 'system-ui, sans-serif', color: '#fff', position: 'relative',
      userSelect: 'none', display: 'flex', flexDirection: 'column'
    }}>
      {/* 🌌 Premium Card Ambient Floating & Entrance Animations */}
      <style>{`
        /* 1. කාඩ් එක ලස්සනට පාවෙවී තියෙන ස්මූත් ඇනිමේෂන් එක */
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.01); }
        }
        /* 2. පෝන් එක ඇතුලට එද්දී කනට ගැහුවා වගේ එන්නේ නැතුව පට්ට ස්මූත් කියුබික් කර්ව් එකකින් මතුවෙන ඇනිමේෂන් එක */
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(25px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: none; }
        }
        .project-card {
          animation: cardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) both, cardFloat 4s infinite ease-in-out;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* 3. හෝවර් හෝ ටච් කරද්දී ලැබෙන ප්‍රිමියම් සයිබර් ග්ලෝ එක */
        .project-card:hover {
          transform: translateY(-10px) scale(1.03) !important;
          border-color: #00ffff !important;
          box-shadow: 0 15px 30px rgba(0, 255, 255, 0.25) !important;
        }
      `}</style>
        
      {/* 🔋 Status Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', fontSize: '11px', color: '#888', background: '#090914' }}>
        <span>9:41</span>
        <span style={{ color: '#00ffff' }}>⚡ MATRIX_OS</span>
      </div>

      {/* 📜 Scrollable Project List */}
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.6rem', color: '#00ffff', letterSpacing: '1px' }}>PROJECTS</h3>
        
        {projects.map((project, index) => (
          <div 
            key={project.id}
            className="project-card"
            onClick={() => {
              if (typeof onProjectSelect === 'function') {
                onProjectSelect(project);
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(0, 255, 255, 0.1)',
              borderRadius: '20px', 
              overflow: 'hidden', 
              cursor: 'pointer',
              // 🌟 එකින් එක ස්මූත් විදියට පෝන් එක ඇතුලෙන් මතුවෙන්න Delay එක ටියුන් කලා මචන්
              animationDelay: `${index * 0.12}s, ${index * 0.4}s` 
            }}
          >
            <img src={project.img} alt={project.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.1rem' }}>{project.title}</h4>
              <p style={{ margin: '0', fontSize: '0.85rem', color: '#aaa', lineHeight: '1.4' }}>{project.desc}</p>
              <span style={{ 
                display: 'inline-block', marginTop: '10px', fontSize: '9px', 
                background: 'rgba(255, 0, 255, 0.15)', color: '#ff00ff', 
                padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255, 0, 255, 0.3)' 
              }}>
                {project.tech}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}