import React, { useState, useRef, useEffect } from 'react';
import { supabase } from './supabaseClient'; // 👈 අපේ Supabase Client එක ඉම්පෝර්ට් කරගන්නවා

// ✍️ TYPEWRITER COMPONENT
const TypewriterText = ({ text, speed = 12 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    let current = '';
    
    const timer = setInterval(() => {
      if (index < text.length) {
        current += text.charAt(index);
        setDisplayedText(current);
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  const isTyping = displayedText.length < text.length;

  return (
    <span>
      {displayedText}
      <span style={{
        display: isTyping ? 'inline-block' : 'none',
        width: '2px', height: '14px', background: '#1d1d1f', marginLeft: '3px',
        verticalAlign: 'middle', animation: 'blink 0.7s infinite'
      }} />
    </span>
  );
};

// 📦 INDIVIDUAL PROJECT CARD COMPONENT
const ProjectCard = ({ project, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => console.log("Video preview pending:", error));
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered]);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: '255px', height: '430px',
        background: 'rgba(255, 255, 255, 0.75)',
        borderRadius: '24px', 
        border: isHovered ? '1px solid rgba(255,255,255,0.95)' : '1px solid rgba(0,0,0,0.05)',
        padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        cursor: 'pointer',
        pointerEvents: 'auto',
        transform: isHovered ? 'translateY(-15px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? `0 20px 35px -10px ${project.glowColor}, 0 10px 20px -5px rgba(0,0,0,0.08)` 
          : '0 8px 25px -15px rgba(0,0,0,0.06)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div>
        <div style={{ 
          width: '100%', height: '140px', borderRadius: '16px', marginBottom: '18px', 
          position: 'relative', overflow: 'hidden', background: project.bgGradient,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={project.imageSrc} 
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: isHovered ? 0 : 1, transition: 'opacity 0.3s ease' }}
          />
          <video
            ref={videoRef}
            src={project.videoSrc}
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        </div>

        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#1d1d1f', fontWeight: '700' }}>{project.title}</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '0.82rem', color: '#86868b', fontWeight: '500', lineHeight: '1.4' }}>{project.tagline}</p>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {project.tags.map(t => (
          <span key={t} style={{ background: 'rgba(0,0,0,0.04)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.68rem', color: '#515154', fontWeight: '600' }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

// 🏛️ MAIN CAROUSEL COMPONENT
export const LiquidCarousel = ({ isZoomed, setIsZoomed }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeProject, setActiveProject] = useState(null);
  
  // 🔄 Supabase Live Data States
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Fetch data from Supabase DB dynamically
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Error fetching projects from Supabase Node:", error);
      } else if (data) {
        // Snake case values ටික පැරණි camelCase වලට හැඩගැස්වීම
        const mappedData = data.map(p => ({
          id: p.id,
          title: p.title,
          tagline: p.tagline,
          tags: p.tags || [],
          summary: p.summary,
          liveLink: p.live_link,
          glowColor: p.glow_color,
          bgGradient: p.bg_gradient,
          imageSrc: p.image_path,
          videoSrc: p.video_path
        }));

        setProjectsData(mappedData);
        if (mappedData.length > 0) {
          setActiveProject(mappedData[0]);
        }
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setActiveProject(selectedProject);
    }
  }, [selectedProject]);

  // ⏳ 3D Screen Loader UI
  if (loading) {
    return (
      <div style={{ 
        width: '900px', height: '600px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', background: 'rgba(5, 5, 13, 0.95)', 
        borderRadius: '16px', fontFamily: 'monospace', color: '#00ffff' 
      }}>
        <div style={{ letterSpacing: '3px', marginBottom: '10px' }}>📥 FETCHING_MATRIX_DATA...</div>
        <div style={{ fontSize: '0.8rem', color: '#ff00ff' }}>CONNECTING TO SUPABASE CORE</div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '900px', height: '600px', 
      background: 'rgba(255, 255, 255, 0.78)', 
      color: '#1d1d1f', display: 'grid',
      gridTemplateColumns: '1fr', gridTemplateRows: '45px 1fr',   
      border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '16px', overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backdropFilter: 'blur(30px)',
      pointerEvents: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }}>
      
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
      
      {/* 🍏 WINDOW HEADER */}
      <div style={{ 
        background: 'rgba(245, 245, 247, 0.85)', display: 'flex', alignItems: 'center', 
        justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid rgba(0,0,0,0.06)', height: '45px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', gap: '8px', width: '25%' }}>
          <span style={{width:'12px', height:'12px', background:'#ff5f56', borderRadius:'50%'}}></span>
          <span style={{width:'12px', height:'12px', background:'#ffbd2e', borderRadius:'50%'}}></span>
          <span style={{width:'12px', height:'12px', background:'#27c93f', borderRadius:'50%'}}></span>
        </div>
        
        <div style={{ color: '#515154', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.5px' }}>
          {selectedProject ? `CASE STUDY // ${selectedProject.title.toUpperCase()}` : "CREATIVE WORKSPACE"}
        </div>

        <div style={{ width: '25%', display: 'flex', justifyContent: 'flex-end' }}>
          {isZoomed && !selectedProject && (
            <button 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                setIsZoomed(false); 
              }}
              style={{ background: '#ff5f56', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,95,86,0.3)' }}
            >
              ✕ CLOSE PC SCREEN
            </button>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={{ background: 'rgba(255, 255, 255, 0.2)', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        
        {/* 🖥️ CONTAINER 1: GRID VIEW */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', gap: '25px',
          opacity: selectedProject ? 0 : 1,
          transform: selectedProject ? 'translateY(-25px) scale(0.96)' : 'translateY(0) scale(1)',
          pointerEvents: selectedProject ? 'none' : 'auto',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isHovered={hoveredId === project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => { 
                setIsZoomed(true); 
                setSelectedProject(project);
              }}
            />
          ))}
        </div>

        {/* 💎 CONTAINER 2: SINGLE CASE STUDY VIEW */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          padding: '40px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px',
          opacity: selectedProject ? 1 : 0,
          transform: selectedProject ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.96)',
          pointerEvents: selectedProject ? 'auto' : 'none',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <button 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              setSelectedProject(null);
            }}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', color: '#1d1d1f', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', zIndex: 110 }}
          >
            ← BACK TO PROJECTS
          </button>

          {/* Left Panel: Video Showcase */}
          <div style={{ background: activeProject?.bgGradient || '#000', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: `inset 0 0 40px rgba(0,0,0,0.4)` }}>
            {activeProject && (
              <video
                src={activeProject.videoSrc}
                muted
                autoPlay
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>

          {/* Right Panel: Descriptions with Typewriter */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px 0' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '2.2rem', color: '#1d1d1f', fontWeight: '800' }}>{activeProject?.title}</h2>
              <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#86868b', fontWeight: '500' }}>{activeProject?.tagline}</p>
              
              <div style={{ display: 'flex', gap: '6px', marginBottom: '25px' }}>
                {activeProject?.tags.map(t => (
                  <span key={t} style={{ background: 'rgba(0,0,0,0.05)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', color: '#1d1d1f', fontWeight: '600' }}>{t}</span>
                ))}
              </div>

              <h4 style={{ margin: '0 0 8px 0', color: '#86868b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700' }}>Project Overview</h4>
              
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#424245', lineHeight: '1.6', fontWeight: '500', minHeight: '140px' }}>
                {selectedProject && activeProject ? (
                  <TypewriterText text={activeProject.summary} speed={12} />
                ) : (
                  <span>{activeProject?.summary}</span>
                )}
              </p>
            </div>

            <a 
              href={activeProject?.liveLink} 
              target="_blank" 
              rel="noreferrer"
              style={{ background: '#1d1d1f', color: '#fff', textDecoration: 'none', padding: '16px 24px', borderRadius: '12px', textAlign: 'center', fontWeight: '700', fontSize: '1rem', display: 'block', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }}
            >
              Launch Live Experience ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};