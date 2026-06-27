import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// 💥 1. THE QUANTUM PARTICLE TRANSMISSION BURST
const LaserTransmissionBurst = ({ position, burstColor }) => {
  const pointsRef = useRef();
  const count = 40;

  const [geoData, vels] = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = [];
    for (let i = 0; i < count; i++) {
      p[i * 3] = position[0];
      p[i * 3 + 1] = position[1];
      p[i * 3 + 2] = position[2];
      v.push((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15);
    }
    return [p, v];
  }, [position]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] += vels[i3];
      posArr[i3 + 1] += vels[i3 + 1];
      posArr[i3 + 2] += vels[i3 + 2];
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.material.opacity -= 0.02; 
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={geoData} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={burstColor} transparent opacity={1} sizeAttenuation={true} />
    </points>
  );
};

// 🔮 2. INDIVIDUAL INTERACTIVE 3D ORB COMPONENT
const CyberFloatingOrb = ({ name, color, position, url, label, isMobileView, children }) => {
  const orbRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const randomPhase = React.useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    if (!orbRef.current) return;
    const t = state.clock.getElapsedTime();

    let targetX = position[0];
    let targetY = position[1];

    if (isHovered) {
      const pull = 0.4;
      targetX += state.pointer.x * pull;
      targetY += state.pointer.y * pull;
    } else {
      targetX += Math.sin(t * 1.5 + randomPhase) * (isMobileView ? 0.02 : 0.06);
      targetY += Math.cos(t * 2.0 + randomPhase) * (isMobileView ? 0.02 : 0.06);
    }

    orbRef.current.position.x = THREE.MathUtils.lerp(orbRef.current.position.x, targetX, 0.1);
    orbRef.current.position.y = THREE.MathUtils.lerp(orbRef.current.position.y, targetY, 0.1);
  });

  return (
    <group ref={orbRef}>
      <mesh 
        visible={false}
        onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
        onPointerOut={() => { setIsHovered(false); }}
        onClick={() => window.open(url, '_blank')}
      >
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      <mesh scale={isHovered ? [1.3, 1.3, 1.3] : (isMobileView ? [0.62, 0.62, 0.62] : [1, 1, 1])}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isHovered ? 3.0 : 0.8}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]} scale={isMobileView ? [0.62, 0.62, 0.62] : [1, 1, 1]}>
        <sphereGeometry args={[0.38, 10, 10]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.25} />
      </mesh>

      <Html center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div style={{
          width: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center',
          transform: isHovered ? 'scale(1.25)' : (isMobileView ? 'scale(0.78)' : 'scale(1)'), 
          transition: 'transform 0.2s ease',
          filter: `drop-shadow(0 0 8px ${color})`
        }}>
          {children}
        </div>
      </Html>

      {!isMobileView && (
        <Html center distanceFactor={6}>
          <div 
            onClick={() => window.open(url, '_blank')}
            className="neon-ambient-glow"
            style={{
              '--pulse-clr': color,
              background: 'rgba(10, 10, 12, 0.85)', backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', color: '#ffffff',
              border: `1px solid ${color}`,
              boxShadow: isHovered ? `0 0 25px ${color}` : '0 4px 10px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap', transform: 'translateY(35px)',
              transition: 'all 0.2s ease', cursor: 'pointer', pointerEvents: 'auto',
              fontFamily: 'monospace', letterSpacing: '1px'
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

// 🏛️ 3. MAIN CONTACT PORTAL SCENE
export const ContactPortal = ({ activePage }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [transmissionStatus, setTransmissionStatus] = useState('READY'); 
  const [burstData, setBurstData] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkResize = () => setIsMobileView(window.innerWidth < 768);
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  if (activePage !== 4) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // 📡 DYNAMIC TRANSMISSION HUB (FORM TAG COMPONENT REMOVED FOR MOBILE SAFETY)
  const handleFormSubmit = async () => {
    // 🚨 Manual Input Validation Check (HTML required එක වෙනුවට සයිබර් විදියට චෙක් කරනවා මචන්)
    if (!formState.name || !formState.email || !formState.message) {
      setTransmissionStatus('EMPTY_FIELDS');
      setTimeout(() => setTransmissionStatus('READY'), 2500);
      return;
    }

    setTransmissionStatus('TRANSMITTING');
    setBurstData({ pos: [2.4, 0, 0], color: '#ff007f' });

    const formData = new FormData();
    formData.append("access_key", "6b41addc-bc23-469f-8381-38b40bca4d0c"); 
    formData.append("name", formState.name);
    formData.append("email", formState.email);
    formData.append("message", formState.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setTransmissionStatus('SUCCESS');
        setBurstData(null);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setTransmissionStatus('READY'), 4000);
      } else {
        console.error("API Rejected:", data);
        setTransmissionStatus('READY');
        setBurstData(null);
      }
    } catch (error) {
      console.error("Pipeline Interrupted:", error);
      setTransmissionStatus('READY');
      setBurstData(null);
    }
  };

  return (
    <group position={[0, 0, 0]}>
      
      <Html>
        <style>{`
          @keyframes neonOrbGlow {
            0% { box-shadow: 0 0 10px var(--pulse-clr); filter: brightness(1); }
            50% { box-shadow: 0 0 25px var(--pulse-clr), 0 0 8px var(--pulse-clr); filter: brightness(1.2); }
            100% { box-shadow: 0 0 10px var(--pulse-clr); filter: brightness(1); }
          }
          .neon-ambient-glow { animation: neonOrbGlow 2.5s infinite ease-in-out; }
          
          .cyber-field-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
          }
          .cyber-prompt-arrow {
            position: absolute;
            left: 18px;
            color: #00ffcc;
            font-family: monospace;
            font-size: 0.9rem;
            font-weight: bold;
            pointer-events: none;
            transition: color 0.3s ease;
          }
          .cyber-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.04) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-radius: 12px !important;
            padding: 14px 18px 14px 35px !important; 
            color: #ffffff !important;
            font-family: monospace !important;
            font-size: 0.9rem !important;
            outline: none !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          }
          .cyber-field-wrapper:focus-within .cyber-prompt-arrow {
            color: #ff007f; 
          }
          .cyber-input:focus {
            border: 1px solid #ff007f !important;
            box-shadow: 0 0 15px rgba(255, 0, 127, 0.3) !important;
            background: rgba(255, 255, 255, 0.08) !important;
          }

          @media (max-width: 768px) {
            .contact-card-container { 
              width: 290px !important; 
              max-width: 90vw !important;
              position: absolute !important;
              left: 50% !important;
              top: 58% !important; 
              transform: translate(-50%, -58%) scale(0.85) !important; 
              padding: 20px !important; 
              background: rgba(10, 10, 14, 0.75) !important; 
              backdrop-filter: blur(14px) !important;
              box-shadow: 0 20px 40px rgba(0, 255, 255, 0.15) !important;
            }
            .contact-card-container h2 { font-size: 1.45rem !important; margin-bottom: 4px !important; }
            .contact-card-container p { font-size: 0.76rem !important; line-height: 1.4 !important; margin-bottom: 12px !important; }
            .contact-card-container .cyber-input { padding: 10px 14px 10px 30px !important; font-size: 0.82rem !important; }
            .contact-card-container .cyber-panel-form { gap: 10px !important; }
            .contact-card-container button { padding: 12px !important; font-size: 0.82rem !important; }
          }
        `}</style>
      </Html>

      {/* 🍏 PREMIUM TERMINAL HUB OVERLAY */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div 
          className="contact-card-container" 
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', left: '6%', top: '50%', transform: 'translateY(-50%)', 
            width: '460px', pointerEvents: 'auto', background: 'rgba(10, 10, 14, 0.45)', 
            backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '28px', padding: '40px', color: '#ffffff', 
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 50px rgba(0, 255, 204, 0.03)',
            display: 'flex', flexDirection: 'column', textAlign: 'left', fontFamily: 'monospace'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
            <span style={{ color: '#00ffcc', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>
              // SECURE_PORTAL.EXE
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
              LOC: PILIMATALAWA, LK
            </span>
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#ffffff', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.5px' }}>
            Let's Build Together
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#a1a1aa', margin: '0 0 30px 0', lineHeight: '1.5', fontFamily: 'system-ui, sans-serif' }}>
            Initialize a high-speed data transmission below to deploy industry-grade interactive systems for your brand.
          </p>

          {/* 🚨 THE REAL FIX: <form> ටැග් එක සම්පූර්ණයෙන්ම <div> එකක් බවට හැරෙව්වා මචන් (No more native mobile reloads!) */}
          <div className="cyber-panel-form" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="cyber-field-wrapper">
              <span className="cyber-prompt-arrow">&gt;</span>
              <input 
                type="text" 
                name="name"
                placeholder="ENTER YOUR NAME" 
                className="cyber-input"
                value={formState.name}
                onChange={handleInputChange}
                disabled={transmissionStatus === 'TRANSMITTING'}
              />
            </div>
            
            <div className="cyber-field-wrapper">
              <span className="cyber-prompt-arrow">&gt;</span>
              <input 
                type="email" 
                name="email"
                placeholder="ENTER YOUR EMAIL" 
                className="cyber-input"
                value={formState.email}
                onChange={handleInputChange}
                disabled={transmissionStatus === 'TRANSMITTING'}
              />
            </div>
            
            <div className="cyber-field-wrapper" style={{ alignItems: 'flex-start' }}>
              <span className="cyber-prompt-arrow" style={{ marginTop: '14px' }}>&gt;</span>
              <textarea 
                rows="4" 
                name="message"
                placeholder="DESCRIBE YOUR EXTRAORDINARY PROJECT ENQUIRY..." 
                className="cyber-input"
                style={{ resize: 'none' }}
                value={formState.message}
                onChange={handleInputChange}
                disabled={transmissionStatus === 'TRANSMITTING'}
              />
            </div>

            {/* 🚀 CUSTOM ACTION TRIGGER BUTTON (Changed type to 'button' with onClick wrapper) */}
            <button 
              type="button"
              onClick={handleFormSubmit}
              disabled={transmissionStatus === 'TRANSMITTING'}
              style={{
                background: transmissionStatus === 'SUCCESS' ? '#00ffcc' : (transmissionStatus === 'TRANSMITTING' ? '#3f3f46' : (transmissionStatus === 'EMPTY_FIELDS' ? '#ef4444' : '#ff007f')),
                color: transmissionStatus === 'SUCCESS' ? '#0a0a0c' : '#ffffff',
                border: 'none', borderRadius: '14px', padding: '16px', fontSize: '0.9rem', fontWeight: 'bold',
                cursor: transmissionStatus !== 'TRANSMITTING' ? 'pointer' : 'not-allowed',
                boxShadow: transmissionStatus === 'READY' ? '0 0 20px rgba(255, 0, 127, 0.4)' : 'none',
                transition: 'all 0.3s ease', letterSpacing: '1.5px', marginTop: '10px'
              }}
            >
              {transmissionStatus === 'READY' && 'LAUNCH TRANSMISSION ↗'}
              {transmissionStatus === 'EMPTY_FIELDS' && '⚠️ PROTOCOL ERROR: FILL ALL FIELDS'}
              {transmissionStatus === 'TRANSMITTING' && 'SYNCHRONIZING SECURE CHANNELS...'}
              {transmissionStatus === 'SUCCESS' && 'TRANSMISSION SUCCESSFUL ✓'}
            </button>

            {/* 🔗 CYBER HOLOGRAPHIC SOCIAL NETWORK LINKS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px', width: '100%' }}>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); window.open('https://www.linkedin.com/in/arjun-sudarshana-045b783aa/', '_blank', 'noopener,noreferrer'); }}
                style={{
                  flex: 1, padding: '10px', background: 'rgba(0, 255, 255, 0.04)', 
                  border: '1px solid rgba(0, 255, 255, 0.3)', color: '#00ffff',
                  borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold', fontFamily: 'monospace',
                  letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s', pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(0, 255, 255, 0.15)'; e.target.style.boxShadow = '0 0 10px #00ffff'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(0, 255, 255, 0.04)'; e.target.style.boxShadow = 'none'; }}
              >
                [ LINKEDIN ]
              </button>
              
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); window.open('https://www.fiverr.com/s/WE5mYzl', '_blank', 'noopener,noreferrer'); }}
                style={{
                  flex: 1, padding: '10px', background: 'rgba(255, 0, 255, 0.04)', 
                  border: '1px solid rgba(255, 0, 255, 0.3)', color: '#ff00ff',
                  borderRadius: '12px', fontSize: '0.78rem', fontWeight: 'bold', fontFamily: 'monospace',
                  letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.2s', pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 0, 255, 0.15)'; e.target.style.boxShadow = '0 0 10px #ff00ff'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 0, 255, 0.04)'; e.target.style.boxShadow = 'none'; }}
              >
                [ FIVERR ]
              </button>
            </div>
          </div>

          <div style={{ marginTop: '35px', display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.5, fontSize: '0.75rem' }}>
            <span>SECURE MAIL // arjunsudarshana@gmail.com</span>
            <span>NEXT WEB SOLUTIONS © 2026 // ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </Html>

      {/* 🪐 4. INTERACTIVE 3D SOCIAL ENCRYPTED ORBS */}
      <group position={isMobileView ? [0, 0, 0] : [2.4, 0, 0]}>
        
        {/* ORB 1: FIVERR NODE */}
        <CyberFloatingOrb 
          name="fiverr" color="#1dbf73" 
          position={isMobileView ? [-0.85, 1.85, 0] : [0, 1.4, 0]} 
          url="https://www.fiverr.com/s/WE5mYzl" label="FIVERR ENGINE // 🟢" isMobileView={isMobileView}
        >
          <svg viewBox="0 0 24 24" fill="#ffffff" width="22" height="22">
            <path d="M23 10.33h-3.41V9.5c0-.68.49-.84.77-.84h2.58V5.33h-3.12c-2.85 0-3.81 1.62-3.81 3.5v1.5H13.6V14h2.42v9.33h3.41V14h3.12l.45-3.67zM8.32 5.33H4.15V9.5H8.32V5.33zm0 4.84H4.15V23.33H8.32V10.17z"/>
          </svg>
        </CyberFloatingOrb>

        {/* ORB 2: LINKEDIN NODE */}
        <CyberFloatingOrb 
          name="linkedin" color="#0077b5" 
          position={isMobileView ? [-0.28, 1.85, 0] : [1.5, 0.4, -0.5]} 
          url="https://www.linkedin.com/in/arjun-sudarshana-045b783aa/" label="LINKEDIN MATRIX // 💼" isMobileView={isMobileView}
        >
          <svg viewBox="0 0 24 24" fill="#ffffff" width="20" height="20">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </CyberFloatingOrb>

        {/* ORB 3: GITHUB NODE */}
        <CyberFloatingOrb 
          name="github" color="#ffffff" 
          position={isMobileView ? [0.28, 1.85, 0] : [-1.5, -0.4, 0.5]} 
          url="https://github.com/arjunsudarshana-code" label="GITHUB REPOS // 🐙" isMobileView={isMobileView}
        >
          <svg viewBox="0 0 24 24" fill="#101014" width="22" height="22">
            <path d="M12 .297c-6.63 0-11 5.373-11 12 0 5.303 3.438 9.8 8.205 11.385.55.082.75-.24.75-.53v-1.84c-3.351.73-4.057-1.615-4.057-1.615-.551-1.398-1.34-1.77-1.34-1.77-1.095-.747.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.2.694.8.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-4.373-12-11-12z"/>
          </svg>
        </CyberFloatingOrb>

        {/* ORB 4: WHATSAPP DIRECT CHAT */}
        <CyberFloatingOrb 
          name="whatsapp" color="#25d366" 
          position={isMobileView ? [0.85, 1.85, 0] : [0, -1.4, 0]} 
          url="https://wa.me/94768745657" label="DIRECT WHATSAPP // 💬" isMobileView={isMobileView}
        >
          <svg viewBox="0 0 24 24" fill="#ffffff" width="22" height="22">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.03 11.966.03c3.184.001 6.177 1.242 8.426 3.496 2.248 2.25 3.486 5.244 3.486 8.433 0 6.619-5.337 11.937-11.906 11.937-2.012-.001-3.991-.51-5.772-1.482L0 24zm6.59-4.817c1.653.982 3.238 1.498 4.938 1.499 5.485 0 9.948-4.414 9.953-9.84a9.756 9.756 0 00-2.853-6.97 9.803 9.751 0 00-6.991-2.871C6.155 2.001 1.69 6.417 1.686 11.843c-.001 1.758.468 3.475 1.358 5.002l-.991 3.619 3.7-.971.094.056zM17.65 14.73c-.313-.156-1.854-.915-2.139-1.018-.286-.104-.494-.156-.702.156-.208.312-.806 1.018-.988 1.248-.183.229-.365.26-.678.104-.312-.156-1.319-.486-2.513-1.373-.928-.828-1.554-1.85-1.736-2.162-.183-.312-.02-.481.136-.636.141-.139.313-.364.47-.546.156-.182.208-.312.313-.52.104-.208.052-.39-.026-.546-.052-.156-.702-1.693-.962-2.317-.253-.609-.51-.527-.702-.53-.182-.003-.39-.003-.598-.003-.208 0-.546.078-.832.39-.286.312-1.092 1.066-1.092 2.6 0 1.534 1.118 3.016 1.274 3.224.156.208 2.2 3.36 5.33 4.71.745.32 1.325.511 1.779.654.748.238 1.43.205 1.968.14.6-.073 1.854-.759 2.115-1.456.26-.697.26-1.299.182-1.427-.078-.128-.286-.208-.6-.364z"/>
          </svg>
        </CyberFloatingOrb>

      </group>

      {burstData && <LaserTransmissionBurst position={burstData.pos} burstColor={burstData.color} />}

    </group>
  );
};

export default ContactPortal;