import React, { useState, useRef, useEffect } from 'react';

// 🗂️ Actual technical data for each project in professional English
const projectsData = [
  {
    id: 1,
    title: "3D Interactive Bottle",
    tagline: "Immersive WebGL Experience",
    tags: ["Three.js", "React Three Fiber", "GLSL Shaders"],
    summary: "An advanced 3D web experience built using React Three Fiber and Three.js. It features realistic physical refractions, custom GLSL shading systems, and HDRI lighting, all optimized for GPU acceleration. Implementation of pointer events and raycasting technology ensures a consistent 60FPS rendering speed across both mobile and desktop devices.",
    liveLink: "https://bottle-animation-omega.vercel.app",
    glowColor: "rgba(0, 255, 150, 0.4)",
    bgGradient: "linear-gradient(135deg, #052e16 0%, #16a34a 100%)",
    imageSrc: "/images/bottle-mockup.jpg",
    videoSrc: "/videos/bottle-hover.mp4"
  },
  {
    id: 2,
    title: "AI Travel Itinerary",
    tagline: "Smart Planner Platform",
    tags: ["React Core", "LLM API Integration", "State Management"],
    summary: "An intelligent travel planning platform directly integrated with an advanced Large Language Model (LLM) API. Utilizing asynchronous data pipelines and robust client-side state management (Zustand/Context), it automatically generates detailed itineraries and map views based on user preferences via real-time token streaming in just a few seconds.",
    liveLink: "https://ai-travel-itinerary-6qzi.bolt.host/",
    glowColor: "rgba(186, 12, 247, 0.4)",
    bgGradient: "linear-gradient(135deg, #3b0764 0%, #a855f7 100%)",
    imageSrc: "/images/travel-mockup.jpg",
    videoSrc: "/videos/travel-hover.mp4"
  },
  {
    id: 3,
    title: "E-Commerce AI Admin",
    tagline: "Next-Gen SaaS Dashboard",
    tags: ["Laravel Architecture", "Data Pipeline", "Telemetry Charts"],
    summary: "A Next-Gen SaaS admin panel created by bridging Laravel backend architecture with a dynamic reactive frontend. Automated data pipelines and relational schema optimizations allow for instantaneous analysis of e-commerce telemetry, leveraging AI to generate automated business insights, forecasts, and interactive charts.",
    liveLink: "https://e-commerce-ai-admin-4e6v.bolt.host/ai-generator",
    glowColor: "rgba(0, 150, 255, 0.4)",
    bgGradient: "linear-gradient(135deg, #023e8a 0%, #0096c7 100%)",
    imageSrc: "/images/ecommerce-mockup.jpg",
    videoSrc: "/videos/ecommerce-hover.mp4"
  }
];

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
  
  // 🔄 Active Project State to maintain layout values during reverse fade-out transitions safely
  const [activeProject, setActiveProject] = useState(projectsData[0]);

  useEffect(() => {
    if (selectedProject) {
      setActiveProject(selectedProject);
    }
  }, [selectedProject]);

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
        
        {/* 🖥️ CONTAINER 1: GRID VIEW (කොටු 3ම පේන වීව් එක - Handles animation forward and backward) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', gap: '25px',
          opacity: selectedProject ? 0 : 1,
          transform: selectedProject ? 'translateY(-25px) scale(0.96)' : 'translateY(0) scale(1)',
          pointerEvents: selectedProject ? 'none' : 'auto',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' // Handles smooth reverse entry
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

        {/* 💎 CONTAINER 2: SINGLE CASE STUDY VIEW (කාඩ් එකක් ඇතුලට යන සහ ආපහු එන වීව් එක - Fully animated both ways) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          padding: '40px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px',
          opacity: selectedProject ? 1 : 0,
          transform: selectedProject ? 'translateY(0) scale(1)' : 'translateY(25px) scale(0.96)',
          pointerEvents: selectedProject ? 'auto' : 'none',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' // Handles smooth exit animation
        }}>
          <button 
            onClick={(e) => { 
              e.preventDefault();
              e.stopPropagation(); 
              setSelectedProject(null); // Triggers the reverse animation perfectly
            }}
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.05)', color: '#1d1d1f', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', zIndex: 110 }}
          >
            ← BACK TO PROJECTS
          </button>

          {/* Left Panel: Video Showcase */}
          <div style={{ background: activeProject.bgGradient, borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: `inset 0 0 40px rgba(0,0,0,0.4)` }}>
            <video
              src={activeProject.videoSrc}
              muted
              autoPlay
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Right Panel: Descriptions with Typewriter */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '5px 0' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '2.2rem', color: '#1d1d1f', fontWeight: '800' }}>{activeProject.title}</h2>
              <p style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#86868b', fontWeight: '500' }}>{activeProject.tagline}</p>
              
              <div style={{ display: 'flex', gap: '6px', marginBottom: '25px' }}>
                {activeProject.tags.map(t => (
                  <span key={t} style={{ background: 'rgba(0,0,0,0.05)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', color: '#1d1d1f', fontWeight: '600' }}>{t}</span>
                ))}
              </div>

              <h4 style={{ margin: '0 0 8px 0', color: '#86868b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: '700' }}>Project Overview</h4>
              
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#424245', lineHeight: '1.6', fontWeight: '500', minHeight: '140px' }}>
                {selectedProject ? (
                  <TypewriterText text={activeProject.summary} speed={12} />
                ) : (
                  <span>{activeProject.summary}</span>
                )}
              </p>
            </div>

            <a 
              href={activeProject.liveLink} 
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