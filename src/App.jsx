import { Canvas, useFrame } from '@react-three/fiber'
import { Float, useGLTF, Html, Environment } from '@react-three/drei'
import { useRef, useState, useMemo, Suspense, useEffect } from 'react' 
import * as THREE from 'three'
import { CameraHandler } from './CameraHandler'
import { LiquidCarousel } from './LiquidCarousel'
import { TechCosmos } from './TechCosmos' 
import ContactPortal from './ContactPortal' 
import { Model as SmartphoneModel } from './Smartphone'
import MobileProjectsUI from './MobileProjectsUI'
import { supabase } from './supabaseClient'; // 👈 අපේ Supabase Client එක මෙතනටත් ඕනේ

// ✍️ PROFILE CARD TYPEWRITER COMPONENT
const ProfileTypewriter = ({ text, speed = 10, startTrigger }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!startTrigger) {
      setDisplayedText('');
      return;
    }
    
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
  }, [text, speed, startTrigger]);

  return <span>{displayedText}</span>;
};

// 🌌 1. Interactive Warp Stars
function InteractiveStars({ activePage, isImploding }) { 
  const count = 3000;
  const pointsRef = useRef();

  const [positions, originalPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orig = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      orig[i * 3] = x; orig[i * 3 + 1] = y; orig[i * 3 + 2] = z;
    }
    return [pos, orig];
  }, [count]);

  useFrame((state) => {
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const t = state.clock.getElapsedTime(); 

    if (isImploding) {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        posArray[i3] = THREE.MathUtils.lerp(posArray[i3], 0, 0.08);
        posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], 0, 0.08);
        posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], 0, 0.08);
      }
    } else {
      const targetX = (state.pointer.x * Math.PI) / 4;
      const targetY = (-state.pointer.y * Math.PI) / 4;
      
      pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (targetX * 0.1) + (t * 0.015), 0.01);
      pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, (targetY * 0.1) + (t * 0.01), 0.01);

      const mouseX = state.pointer.x * (state.viewport.width / 2);
      const mouseY = state.pointer.y * (state.viewport.height / 2);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        if (activePage === 4) {
          posArray[i3 + 2] += 0.35; 
          if (posArray[i3 + 2] > 10) posArray[i3 + 2] = -20;
        } else {
          const x = posArray[i3];
          const y = posArray[i3 + 1];
          const z = posArray[i3 + 2];
          const origX = originalPositions[i3];
          const origY = originalPositions[i3 + 1];
          const origZ = originalPositions[i3 + 2];
          
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 2.5) {
            const force = (2.5 - dist) * 0.15;
            const angle = Math.atan2(dy, dx);
            posArray[i3] += Math.cos(angle) * force;
            posArray[i3 + 1] += Math.sin(angle) * force;
          } else {
            posArray[i3] = THREE.MathUtils.lerp(x, origX, 0.04);
            posArray[i3 + 1] = THREE.MathUtils.lerp(y, origY, 0.04);
          }
          posArray[i3 + 2] = THREE.MathUtils.lerp(z, origZ, 0.04);
        }
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={ activePage === 4 ? 0.09 : 0.06 } color="#aaffff" transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
}

// 🤖 2. 3D AI Core
function SciFiAICore({ matrixEntered, activePage, isImploding, isMobile }) { 
  const groupRef = useRef()
  const coreRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const speedMultiplier = isImploding ? 12 : (activePage === 4 ? 4 : 1);

    coreRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05)
    coreRef.current.rotation.y = t * 0.5 * speedMultiplier
    coreRef.current.rotation.x = t * 0.2 * speedMultiplier
    ring1Ref.current.rotation.x = t * 0.8 * speedMultiplier
    ring1Ref.current.rotation.y = t * 0.3 * speedMultiplier
    ring2Ref.current.rotation.x = t * 0.4 * speedMultiplier
    ring2Ref.current.rotation.y = t * 0.9 * speedMultiplier

    if (isImploding) {
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 0, 0.08));
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    } else if (matrixEntered) {
      if (activePage === 1) {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, isMobile ? 0 : -2, 0.04);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, isMobile ? 1.5 : 0, 0.04);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.04); 
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, isMobile ? 0.7 : 1, 0.05));
      } else if (activePage === 2) {
        const targetX = isMobile ? 0.8 : 2.8;
        const targetY = isMobile ? -1.35 : -1.5;
        const targetZ = isMobile ? -0.7 : 0;
        const targetScale = isMobile ? 0.76 : 1;

        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04); 
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04); 
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04); 
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));
      } else if (activePage === 3) {
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 0, 0.08));
      } else if (activePage === 4) {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.04);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 1.2, 0.04);
        groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.04);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1.4, 0.05));
      }
    } else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.04);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.04);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, 1, 0.04));
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} wireframe={true} />
      </mesh>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1.5} />
      </mesh>
    </group>
  )
}

// 💻 3. Laptop Component
function LaptopComponent({ matrixEntered, activePage, setIsZoomed, isZoomed }) {
  const { scene } = useGLTF('/laptop.glb') 
  const groupRef = useRef()
  const laptopModelRef = useRef()
  const htmlGroupRef = useRef()

  const htmlX = 3.56, htmlY = 1.55, htmlZ = 3.75;
  const rotX = -0.20, rotY = -2.40, rotZ = -0.13;
  const htmlScale = 1.87;
  const lapRotO = [0.23, -0.85, -0.07]; 
  const lapRotZ = [0.06, 2.30, -0.51]; 

  useFrame(() => {
    if (!groupRef.current || !laptopModelRef.current || !htmlGroupRef.current) return;

    if (matrixEntered && activePage === 2) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1.3, 0.05);
    } else {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -15, 0.05);
    }

    const targetLapRot = isZoomed ? lapRotZ : lapRotO;
    laptopModelRef.current.rotation.x = THREE.MathUtils.lerp(laptopModelRef.current.rotation.x, targetLapRot[0], 0.08);
    laptopModelRef.current.rotation.y = THREE.MathUtils.lerp(laptopModelRef.current.rotation.y, targetLapRot[1], 0.08);
    laptopModelRef.current.rotation.z = THREE.MathUtils.lerp(laptopModelRef.current.rotation.z, targetLapRot[2], 0.08);

    const targetHtmlPos = isZoomed ? [htmlX, htmlY, htmlZ] : [-0.50, 0.72, -0.36];
    const targetHtmlRot = isZoomed ? [rotX, rotY, rotZ] : [0.15, 0.72, 0.06];
    const targetHtmlScale = isZoomed ? htmlScale : 0.37;

    htmlGroupRef.current.position.x = THREE.MathUtils.lerp(htmlGroupRef.current.position.x, targetHtmlPos[0], 0.08);
    htmlGroupRef.current.position.y = THREE.MathUtils.lerp(htmlGroupRef.current.position.y, targetHtmlPos[1], 0.08);
    htmlGroupRef.current.position.z = THREE.MathUtils.lerp(htmlGroupRef.current.position.z, targetHtmlPos[2], 0.08);

    htmlGroupRef.current.rotation.x = THREE.MathUtils.lerp(htmlGroupRef.current.rotation.x, targetHtmlRot[0], 0.08);
    htmlGroupRef.current.rotation.y = THREE.MathUtils.lerp(htmlGroupRef.current.rotation.y, targetHtmlRot[1], 0.08);
    htmlGroupRef.current.rotation.z = THREE.MathUtils.lerp(htmlGroupRef.current.rotation.z, targetHtmlRot[2], 0.08);

    const nextScale = THREE.MathUtils.lerp(htmlGroupRef.current.scale.x, targetHtmlScale, 0.08);
    htmlGroupRef.current.scale.set(nextScale, nextScale, nextScale);
  });
  
  return (
    <group ref={groupRef} position={[-1, -30, 0.1]}>
        <Environment preset="city" environmentIntensity={0.8} />
        <directionalLight position={[0, 10, 5]} intensity={1.5} color="#ffffff" />
        <ambientLight intensity={0.6} />

        <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
          <group ref={laptopModelRef}>
            <primitive object={scene} scale={0.3} />
          </group>

          <group ref={htmlGroupRef}>
            <Html transform distanceFactor={1.6}>
              <LiquidCarousel isZoomed={isZoomed} setIsZoomed={setIsZoomed} />
            </Html>
          </group>
        </Float>
    </group>
  )
}

// 📱 3.5 Smartphone Component
function SmartphoneComponent({ matrixEntered, activePage, onProjectSelect, selectedProject }) { 
  const groupRef = useRef()

  useFrame(() => {
    if (!groupRef.current) return

    if (selectedProject) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -12, 0.05) 
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -5, 0.05)
    } 
    else if (matrixEntered && activePage === 2) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.6, 0.05)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.05)
    } 
    else {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -12, 0.05)
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -5, 0.05)
    }
  })

  return (
    <group ref={groupRef} position={[0, -12, 0]}>
      <Environment preset="city" environmentIntensity={0.7} />
      <directionalLight position={[0, 5, 5]} intensity={1.2} />

      <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group>
          <SmartphoneModel scale={[0.18, 0.18, 0.18]} rotation={[0, 0.4, 0]} />
          <group rotation={[0, 0.4, 0]} position={[0, 0, 0.02]}>
            <Html transform distanceFactor={1.15} pointerEvents="auto" style={{ pointerEvents: 'auto' }}>
              <MobileProjectsUI onProjectSelect={onProjectSelect} />
            </Html>
          </group>
        </group>
      </Float>
    </group>
  )
}

// 🌌 FUTURISTIC MATRIX OS EXPERIENTIAL SWIPER OVERLAY (🌟 DYNAMICALLY UPDATED FOR SUPABASE)
function MatrixOSSwiper({ selectedProject, setSelectedProject }) {
  const [videoLoading, setVideoLoading] = useState(false);
  const [mobileProjects, setMobileProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📥 Live fetch project data specifically for mobile view routing
  useEffect(() => {
    const fetchMobileData = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });

      if (data) {
        const mapped = data.map(p => ({
          id: p.id,
          title: p.title,
          desc: p.summary ? p.summary.substring(0, 150) + "..." : "",
          video: p.video_path,
          tech: p.tags && p.tags.length > 0 ? p.tags[0] : 'React Tech',
          url: p.live_link
        }));
        setMobileProjects(mapped);
      }
      setLoading(false);
    };
    fetchMobileData();
  }, []);

  if (loading || mobileProjects.length === 0) return null;

  const currentIndex = mobileProjects.findIndex(p => p.id === selectedProject.id);
  const validIndex = currentIndex !== -1 ? currentIndex : 0; 
  const currentProjectUrl = mobileProjects[validIndex]?.url || '#';

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIndex = (validIndex + 1) % mobileProjects.length;
    setSelectedProject(mobileProjects[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIndex = (validIndex - 1 + mobileProjects.length) % mobileProjects.length;
    setSelectedProject(mobileProjects[prevIndex]);
  };

  return (
    <div 
      key={selectedProject.id}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: '#05050d', zIndex: 999999, display: 'flex', flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif', color: '#fff', pointerEvents: 'auto',
        animation: 'matrixGlitchIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both' 
      }}
    >
      <style>{`
        @keyframes matrixGlitchIn {
          0% { opacity: 0; filter: blur(15px) brightness(0.6) transform: scale(0.96); }
          100% { opacity: 1; filter: blur(0px) brightness(1) transform: scale(1); }
        }
        @keyframes lucidPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 5px rgba(0, 255, 255, 0.2); }
          50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.85), inset 0 0 12px rgba(0, 255, 255, 0.4); }
        }
        @keyframes cyberPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; text-shadow: 0 0 10px #00ffff; }
        }
        @keyframes loadingBarMove {
          0% { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
      
      {/* 📸 Project Header LIVE VIDEO Panel */}
      <div style={{ position: 'relative', width: '100%', height: '38vh', overflow: 'hidden', background: '#05050d' }}>
        
        {videoLoading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#05050d', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', gap: '12px', zIndex: 5
          }}>
            <div style={{ fontFamily: 'monospace', color: '#00ffff', fontSize: '11px', letterSpacing: '3px', animation: 'cyberPulse 1.2s infinite ease-in-out' }}>
              📥 BUFFERING_STREAM...
            </div>
            <div style={{ width: '130px', height: '2px', background: 'rgba(0, 255, 255, 0.1)', position: 'relative', overflow: 'hidden', borderRadius: '2px' }}>
              <div style={{ position: 'absolute', width: '40px', height: '100%', background: '#00ffff', boxShadow: '0 0 10px #00ffff', animation: 'loadingBarMove 1s infinite linear' }} />
            </div>
          </div>
        )}

        <video 
          key={mobileProjects[validIndex].video}
          src={mobileProjects[validIndex].video}
          autoPlay 
          loop 
          muted 
          playsInline 
          onWaiting={() => setVideoLoading(true)}
          onPlaying={() => setVideoLoading(false)}
          onCanPlay={() => setVideoLoading(false)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
        />

        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 6px 100%', pointerEvents: 'none', zIndex: 2
        }} />

        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '70px',
          background: 'linear-gradient(to bottom, rgba(5,5,13,0.95), transparent)',
          display: 'flex', justifyContent: 'space-between', padding: '0 20px', alignItems: 'center', zIndex: 6
        }}>
          <button 
            onClick={() => setSelectedProject(null)}
            style={{
              padding: '8px 18px', background: 'rgba(2, 2, 5, 0.85)', backdropFilter: 'blur(10px)',
              color: '#00ffff', border: '1px solid #00ffff', borderRadius: '20px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '10px', boxShadow: '0 0 15px rgba(0,255,255,0.4)',
              letterSpacing: '1px'
            }}
          >
            ✕ CLOSE OS
          </button>
          
          <div style={{
            fontFamily: 'monospace', color: '#ff00ff', background: 'rgba(0,0,0,0.7)',
            padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,0,255,0.3)',
            fontSize: '11px', letterSpacing: '1px', fontWeight: 'bold'
          }}>
            SYSTEM_OS // 0{validIndex + 1}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '15px', right: '20px', display: 'flex', gap: '10px', zIndex: 6 }}>
          <button onClick={handlePrev} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(2,2,5,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>‹</button>
          <button onClick={handleNext} style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(2,2,5,0.9)', border: '1px solid #00ffff', color: '#00ffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', boxShadow: '0 0 15px rgba(0,255,255,0.3)' }}>›</button>
        </div>
      </div>
      
      {/* Project Content Body */}
      <div style={{ padding: '30px 24px', flex: 1, background: 'linear-gradient(to bottom, #090914, #020205)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '10px', background: 'rgba(0, 255, 255, 0.12)', color: '#00ffff', padding: '5px 12px', borderRadius: '12px', border: '1px solid rgba(0, 255, 255, 0.3)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            {mobileProjects[validIndex].tech}
          </span>
          <h2 style={{ margin: '18px 0 12px 0', fontSize: '1.7rem', color: '#fff', textShadow: '0 0 15px rgba(0,255,255,0.25)', letterSpacing: '0.5px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {mobileProjects[validIndex].title}
          </h2>
          <p style={{ margin: '0', color: '#ccc', fontSize: '0.92rem', lineHeight: '1.6', fontFamily: 'system-ui' }}>
            {mobileProjects[validIndex].desc}
          </p>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (currentProjectUrl !== '#') {
              window.open(currentProjectUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          style={{
            width: '100%', padding: '15px', 
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(0, 188, 188, 0.05) 100%)', 
            backdropFilter: 'blur(12px)', color: '#00ffff', border: '1px solid rgba(0, 255, 255, 0.4)', 
            borderRadius: '14px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer', 
            fontSize: '0.95rem', textTransform: 'uppercase', animation: 'lucidPulse 2.5s infinite ease-in-out',
            transition: 'all 0.3s ease', marginBottom: '15px'
          }}
        >
          LAUNCH LIVE APP 🚀
        </button>
      </div>
    </div>
  );
}

// 🏛️ 4. MAIN APP COMPONENT
function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [matrixEntered, setMatrixEntered] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false); 
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isImploding, setIsImploding] = useState(false); 
  
  const [activePage, setActivePage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // 📱 MOBILE RESPONSIVE DETECTION EFFECT
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🚀 BULLETPROOF MOBILE SWIPE LISTENER
  useEffect(() => {
    let startY = 0;

    const handleGlobalTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleGlobalTouchEnd = (e) => {
      if (!matrixEntered || isZoomed || isImploding) return; 

      const endY = e.changedTouches[0].clientY;
      const deltaY = startY - endY;

      if (deltaY > 40) {
        setActivePage((prev) => Math.min(prev + 1, 4));
        setIsAboutExpanded(false);
      } else if (deltaY < -40) {
        setActivePage((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
    window.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleGlobalTouchStart);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [matrixEntered, isZoomed, isImploding]);

  const handleScroll = (e) => {
    if (!matrixEntered || isZoomed || isImploding) return; 
    if (e.deltaY > 20) {
      setActivePage((prev) => Math.min(prev + 1, 4));
      setIsAboutExpanded(false); 
    } else if (e.deltaY < -20) {
      setActivePage((prev) => Math.max(prev - 1, 1));
    }
  };

  const triggerMatrixEntry = () => {
    setIsImploding(true); 
    setTimeout(() => {
      setMatrixEntered(true);
      setActivePage(1);
      setIsImploding(false); 
    }, 1300); 
  };

  return (
    <div 
      onWheel={handleScroll} 
      style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#020205', overflow: 'hidden' }}
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <CameraHandler matrixEntered={matrixEntered} showProjects={activePage === 2} isZoomed={isZoomed} /> 
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <InteractiveStars activePage={activePage} isImploding={isImploding} /> 
          <SciFiAICore matrixEntered={matrixEntered} activePage={activePage} isImploding={isImploding} isMobile={isMobile} />
          
          {isMobile ? (
            <SmartphoneComponent matrixEntered={matrixEntered} activePage={activePage} onProjectSelect={setSelectedProject} selectedProject={selectedProject} />
          ) : (
            <LaptopComponent matrixEntered={matrixEntered} activePage={activePage} setIsZoomed={setIsZoomed} isZoomed={isZoomed} />
          )}
          
          <TechCosmos activePage={activePage} />
          <ContactPortal activePage={activePage} />
        </Suspense>
      </Canvas>

      {/* 平面 UI OVERLAYS LAYER */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif', transition: 'all 0.5s ease-in-out'
      }}>
        
        {/* 🍏 SCREEN 0: LANDING VIEW */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          opacity: matrixEntered ? 0 : 1, 
          transform: isImploding ? 'scale(0) rotate(180deg)' : (matrixEntered ? 'scale(1.2)' : 'scale(1)'),
          filter: isImploding ? 'blur(15px)' : 'none',
          transition: isImploding ? 'all 1.2s cubic-bezier(0.6, -0.28, 0.735, 0.045)' : 'all 0.8s ease-in-out', 
          pointerEvents: (matrixEntered || isImploding) ? 'none' : 'auto', position: 'absolute',
          fontFamily: 'monospace'
        }}>
          <p style={{ color: '#ff00ff', fontSize: '1rem', letterSpacing: '5px', marginBottom: '5px' }}>SYSTEM INITIALIZED</p>
          <h1 style={{ fontSize: '4.5rem', margin: '0', textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 0 20px #00ffff' }}>
             <span style={{ fontWeight: '300' }}>Matrix</span>
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, letterSpacing: '2px', marginTop: '10px' }}>NEXT-GEN WEB DEVELOPER</p>
          <button 
            onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} 
            onClick={triggerMatrixEntry} 
            style={{
              marginTop: '40px', padding: '12px 35px', fontSize: '1rem', letterSpacing: '2px',
              color: isHovered ? '#00ffff' : '#020205', backgroundColor: isHovered ? 'transparent' : '#00ffff',
              border: '2px solid #00ffff', cursor: 'pointer', pointerEvents: 'auto', textTransform: 'uppercase', fontWeight: 'bold',
              boxShadow: isHovered ? '0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 10px rgba(0, 255, 255, 0.5)' : '0 0 20px rgba(0, 255, 255, 0.3)',
              transition: 'all 0.3s ease-in-out'
            }}>
            {isHovered ? '> ENTER MATRIX <' : 'ENTER MATRIX'}
          </button>
        </div>

        {/* 🍏 SCREEN 1: PROFILE ABOUT VIEW */}
        <div style={{
          position: 'absolute', 
          right: isMobile ? '5%' : '10%', 
          left: isMobile ? '5%' : 'auto',
          top: isMobile ? '2%' : '0', 
          height: '100%', 
          width: isMobile ? '90%' : '35%', 
          opacity: (matrixEntered && activePage === 1) ? 1 : 0, 
          transform: !matrixEntered ? 'translateY(50px)' : (activePage !== 1 ? 'translateY(-200px)' : 'translateY(0)'),
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
          pointerEvents: (matrixEntered && activePage === 1) ? 'auto' : 'none',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <div 
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            onMouseEnter={() => setIsImgHovered(true)}
            onMouseLeave={() => setIsImgHovered(false)}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              backgroundColor: isAboutExpanded ? 'rgba(0, 255, 255, 0.05)' : 'transparent', 
              padding: isMobile ? '20px 15px' : (isAboutExpanded ? '30px' : '10px'), 
              borderRadius: '20px',
              border: isAboutExpanded ? '1px solid rgba(0, 255, 255, 0.2)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', width: '100%'
            }}
          >
            <div style={{
              width: isMobile ? '160px' : '260px', 
              height: isMobile ? '160px' : '260px', 
              borderRadius: '50%', 
              marginBottom: isMobile ? '15px' : (isAboutExpanded ? '25px' : '0px'),
              backgroundImage: 'url(/profile.jpg.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center',
              border: isImgHovered ? '4px solid #00ffff' : '4px solid rgba(0, 255, 255, 0.6)', 
              transform: isImgHovered ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isImgHovered ? '0 0 45px rgba(0, 255, 255, 0.9), 0 0 80px rgba(0, 255, 255, 0.5)' : isAboutExpanded ? '0 0 20px rgba(0, 255, 255, 0.3)' : '0 0 35px rgba(0, 255, 255, 0.7), 0 0 60px rgba(0, 255, 255, 0.3)',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}></div>
            
            <div style={{
              opacity: isAboutExpanded ? 1 : 0, maxHeight: isAboutExpanded ? '400px' : '0px', 
              transform: isAboutExpanded ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden', textAlign: 'center'
            }}>
              <h2 style={{ 
                color: '#00ffff', fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 10px 0', 
                letterSpacing: '3px', fontFamily: 'monospace', textShadow: '0 0 15px rgba(0, 255, 255, 0.5)' 
              }}>
                Arjun Sudarshana
              </h2>
              <p style={{ 
                margin: '0 10px', opacity: 0.9, fontSize: isMobile ? '0.95rem' : '1.1rem', 
                lineHeight: '1.6', color: '#e0e0e0', maxWidth: '450px', fontFamily: 'system-ui' 
              }}>
                <ProfileTypewriter 
                  startTrigger={matrixEntered && activePage === 1 && isAboutExpanded}
                  speed={12}
                  text="Bridging the gap between immersive 3D visuals and scalable full-stack architecture. I specialize in crafting high-performance digital products that blend creative design with logical precision."
                />
              </p>
            </div>
          </div>
          
          <p style={{ 
            marginTop: isMobile ? '25px' : '50px', fontSize: isMobile ? '0.8rem' : '0.9rem', 
            color: '#00ffff', letterSpacing: '2px', opacity: 0.6, fontFamily: 'monospace' 
          }}>
            SCROLL DOWN FOR PROJECTS (v)
          </p>
        </div>

        {/* 🍏 SCREEN 2: LAPTOP CAROUSEL PROJECT TIP HELPERS */}
        <div style={{
          position: 'absolute', left: '10%', bottom: '15%', height: 'auto', width: '45%', 
          opacity: (matrixEntered && activePage === 2) ? 1 : 0, 
          transform: activePage !== 2 ? 'translateY(100px)' : 'translateY(0)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'monospace'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#ff00ff', letterSpacing: '2px', opacity: 0.6 }}>
            (^) SCROLL UP FOR PROFILE / (v) SCROLL DOWN FOR TECH STACK
          </p>
        </div>

        {/* 🍏 PERSISTENT MASTER SYSTEM REBOOT BUTTON */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          opacity: matrixEntered ? 1 : 0, transition: 'all 0.8s ease-in-out', pointerEvents: matrixEntered ? 'auto' : 'none',
        }}>
          <button onClick={() => { setMatrixEntered(false); setActivePage(1); }} style={{
            padding: '10px 25px', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', 
            cursor: 'pointer', transition: 'all 0.3s ease', letterSpacing: '2px', fontFamily: 'monospace'
          }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = '#00ffff'; e.target.style.color = '#00ffff'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'; e.target.style.color = 'white'; }}
          >
            {'< SYSTEM REBOOT'}
          </button>
        </div>
        
        {/* 🌟 TRUE VIEWPORT CINEMATIC MATRIX_OS SMART SWIPER */}
        {selectedProject && (
          <MatrixOSSwiper selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        )}
        
      </div>
    </div>
  )
}

useGLTF.preload('/laptop.glb')
export default App;