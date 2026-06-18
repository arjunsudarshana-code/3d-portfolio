import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// 🗂️ High-End Tech Details Dictionary for International Clients
const techDetails = {
  "React / R3F": {
    title: "React Three Fiber",
    summary: "Specializing in architecting component-driven 3D scenes with modular application states. Seamlessly binding reactive HTML overlays directly within declarative WebGL viewports to deliver beautiful, responsive digital products."
  },
  "Three.js / WebGL": {
    title: "Three.js & WebGL Engine",
    summary: "Leveraging raw WebGL frameworks, custom GLSL matrix shaders, illumination variables, and complex mathematical raycasting algorithms to render smooth fluid vectors and interactive elements locked at a consistent 60FPS."
  },
  "Laravel Core": {
    title: "Laravel Architecture",
    summary: "Designing enterprise-grade server-side engines, optimizing relational database schemas, handling complex query executions, and building highly secure, modular RESTful/GraphQL backend structures from the ground up."
  },
  "Python FastAPI": {
    title: "Python FastAPI Blueprint",
    summary: "Deploying high-performance asynchronous data routing channels and microservices pipelines. Specifically optimized for low-latency artificial intelligence model integrations, dynamic webhooks, and secure cloud workflows."
  },
  "Node.js Engine": {
    title: "Node.js Runtime Environment",
    summary: "Building lightweight, event-driven asynchronous microservices architectures. Engineering high-speed custom websocket layers to maintain instant real-time data syncs across intensive enterprise web applications."
  },
  "Docker / DevOps": {
    title: "Docker & Cloud DevOps",
    summary: "Containerizing complex full-stack micro-systems to ensure 100% development stability. Designing continuous deployment automations, server load balancers, and optimizing distributed node clusters across international cloud architectures."
  }
};

// 🛠️ Personalized Full-Stack Technical Nodes
const techNodes = [
  { name: "React / R3F", color: "#61dafb", ring: 1, angle: 0 },
  { name: "Three.js / WebGL", color: "#ff007f", ring: 1, angle: Math.PI },
  { name: "Laravel Core", color: "#ff2d20", ring: 2, angle: 0 },
  { name: "Python FastAPI", color: "#009688", ring: 2, angle: Math.PI },
  { name: "Node.js Engine", color: "#68a063", ring: 3, angle: Math.PI / 2 },
  { name: "Docker / DevOps", color: "#2496ed", ring: 3, angle: -Math.PI / 2 }
];

// ✍ *LOCAL TYPEWRITER EFFECT*
const TypewriterText = ({ text, speed = 8 }) => {
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

  return <span>{displayedText}</span>;
};

// 🤖 1. ULTRA-PREMIUM 3D QUANTUM REACTOR CORE
const QuantumCore = ({ activePulse, coreColor }) => {
  const innerKnotRef = useRef();
  const middleCageRef = useRef();
  const outerShieldRef = useRef();

  const currentCoreColor = activePulse ? coreColor : "#00ffff";
  const currentShieldColor = activePulse ? coreColor : "#a855f7";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const dynamicSpeed = activePulse ? 5 : 1;

    if (innerKnotRef.current) {
      innerKnotRef.current.scale.setScalar(0.75 + Math.sin(t * 3) * 0.04);
      innerKnotRef.current.rotation.z = -t * 0.8 * dynamicSpeed;
      innerKnotRef.current.rotation.x = t * 0.4 * dynamicSpeed;
    }
    if (middleCageRef.current) {
      middleCageRef.current.rotation.y = t * 0.3 * dynamicSpeed;
      middleCageRef.current.rotation.x = t * 0.15 * dynamicSpeed;
    }
    if (outerShieldRef.current) {
      outerShieldRef.current.rotation.x = t * 0.1 * dynamicSpeed;
      outerShieldRef.current.rotation.y = -t * 0.2 * dynamicSpeed;
    }
  });

  return (
    <group>
      <pointLight position={[3, 3, 3]} intensity={activePulse ? 15 : 4} color={currentCoreColor} />
      <pointLight position={[-3, -3, -3]} intensity={activePulse ? 10 : 2} color="#ff00ff" />
      <pointLight position={[0, 0, 0]} intensity={activePulse ? 25 : 6} color={currentCoreColor} distance={6} />

      <mesh ref={innerKnotRef}>
        <torusKnotGeometry args={[0.38, 0.12, 120, 12]} />
        <meshStandardMaterial 
          color="#061f24" 
          emissive={currentCoreColor} 
          emissiveIntensity={activePulse ? 5.0 : 0.4}     
          metalness={0.95} 
          roughness={0.15} 
          flatShading={true} />
      </mesh>

      <mesh ref={middleCageRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial 
          color={activePulse ? currentCoreColor : "#00ffcc"} 
          wireframe={true} 
          emissive={currentCoreColor}
          emissiveIntensity={activePulse ? 2.5 : 0.6}
          metalness={0.8}
          roughness={0.2} />
      </mesh>
      
      <mesh ref={outerShieldRef}>
        <torusGeometry args={[1.55, 0.03, 16, 80]} />
        <meshStandardMaterial 
          color={currentShieldColor} 
          emissive={currentShieldColor} 
          emissiveIntensity={activePulse ? 3.5 : 0.8}
          metalness={0.9}
          roughness={0.1} />
      </mesh>
    </group>
  );
};

// 💥 2. THE QUANTUM PARTICLE SPLASH EFFECT
const ParticleExplosion = ({ position, burstColor }) => {
  const pointsRef = useRef();
  const count = 30;

  const [geoData, vels] = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = [];
    for (let i = 0; i < count; i++) {
      p[i * 3] = position[0];
      p[i * 3 + 1] = position[1];
      p[i * 3 + 2] = position[2];
      v.push((Math.random() - 0.5) * 0.09, (Math.random() - 0.5) * 0.09, (Math.random() - 0.5) * 0.09);
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
    pointsRef.current.material.opacity -= 0.016; 
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={geoData} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color={burstColor} transparent opacity={1} sizeAttenuation={true} />
    </points>
  );
};

// 🎯 3. PERFECTED TECH NODE INSTANCE
const TechNodeInstance = ({ node, radius, pulsingNode, hoveredNode, setHoveredNode, onNodeHover, handleNodeClick }) => {
  const visualGroupRef = useRef(); 
  const isPulsing = pulsingNode === node.name;
  const isHovered = hoveredNode === node.name;
  const baseCoordinates = [Math.cos(node.angle) * radius, Math.sin(node.angle) * radius, 0];

  const randomPhase = React.useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    if (!visualGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    let targetX = 0;
    let targetY = 0;

    if (isHovered) {
      const pullAmt = 0.35; 
      targetX = state.pointer.x * pullAmt;
      targetY = state.pointer.y * pullAmt;
    } else {
      targetX = Math.sin(t * 4 + randomPhase) * 0.04;
      targetY = Math.cos(t * 5 + randomPhase) * 0.04;
    }

    visualGroupRef.current.position.x = THREE.MathUtils.lerp(visualGroupRef.current.position.x, targetX, 0.1);
    visualGroupRef.current.position.y = THREE.MathUtils.lerp(visualGroupRef.current.position.y, targetY, 0.1);
  });

  return (
    <group position={baseCoordinates}>
      <mesh 
        visible={false} 
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHoveredNode(node.name); if(onNodeHover) onNodeHover(node.name);
        }}
        onPointerOut={() => { 
          setHoveredNode(null); if(onNodeHover) onNodeHover(null);
        }}
        onClick={(e) => { 
          e.stopPropagation(); 
          handleNodeClick(node, baseCoordinates); 
        }}
      >
        <sphereGeometry args={[0.55, 16, 16]} /> 
        <meshBasicMaterial />
      </mesh>

      <group ref={visualGroupRef}>
        <mesh scale={isPulsing ? [2.2, 2.2, 2.2] : [1, 1, 1]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={isPulsing ? "#ffffff" : node.color} />
        </mesh>
        
        <Html center distanceFactor={6}>
          <div 
            onClick={(e) => { e.stopPropagation(); handleNodeClick(node, baseCoordinates); }}
            className={`neon-ambient-glow ${isPulsing ? "holo-click-reaction" : ""}`}
            style={{
              '--pulse-clr': node.color,
              background: isPulsing ? '#ffffff' : 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)',
              padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: '#1d1d1f',
              border: `1px solid ${node.color}`, 
              boxShadow: hoveredNode === node.name ? `0 0 20px ${node.color}` : `0 0 10px rgba(255,255,255,0.1)`,
              whiteSpace: 'nowrap', transform: isHovered ? 'scale(1.12)' : 'scale(1)', transition: 'all 0.2s ease',
              cursor: 'pointer', pointerEvents: 'auto'
            }}
          >
            {node.name}
          </div>
        </Html>
      </group>
    </group>
  );
};

// 🎡 4. INDIVIDUAL ORBIT RING COMPONENT
const OrbitRing = ({ rotationX, rotationY, radius, speed, children }) => {
  const ringRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * speed;
    }
  });

  return (
    <group rotation={[rotationX, rotationY, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.015, 6, 64]} />
        <meshBasicMaterial color="rgba(255,255,255,0.12)" transparent />
      </mesh>
      <group ref={ringRef}>
        {children}
      </group>
    </group>
  );
};

// 🏛 *MAIN 3D COSMOS SCENE*
export const TechCosmos = ({ activePage, onNodeHover }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pulsingNode, setPulsingNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const [coreColor, setCoreColor] = useState("#00ffff");
  const [burstData, setBurstData] = useState(null);

  const handleNodeClick = (node, coordinates) => {
    setPulsingNode(node.name);
    setSelectedNode(node.name); 
    setCoreColor(node.color); 
    setBurstData({ pos: coordinates, color: node.color }); 

    setTimeout(() => {
      setPulsingNode(null);
      setBurstData(null);
    }, 5000); 
  };

  const activeDisplayNode = selectedNode || hoveredNode;

  if (activePage !== 3) return null;

  return (
    // 🌟 1. FIXED WRAPPER: ප්‍රධාන 3D ශිෆ්ට් එකෙන් එලියට අරන්, ස්ක්‍රීන් එකට සාපේක්ෂව කාඩ් එක තැබීම මචන්!
    <group> 
      
      {/* 🍏 PREMIUM GLASS CARD OVERLAY (Moved outside the shifted group for perfect screen alignment) */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div 
          className="tech-card-container"
          style={{
            position: 'absolute', 
            left: '4%', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            width: '420px', 
            pointerEvents: 'auto', 
            background: 'rgba(255, 255, 255, 0.08)', 
            backdropFilter: 'blur(16px)', 
            border: '1px solid rgba(255, 255, 255, 0.15)', 
            borderRadius: '24px', 
            padding: '35px', 
            color: '#ffffff', 
            boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.1)',
            display: 'flex', 
            flexDirection: 'column', 
            textAlign: 'left',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <span style={{ color: '#c084fc', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '10px' }}>
            {activeDisplayNode ? "SYSTEM NODE // ACTIVE" : "TECHNICAL ECOSYSTEM"}
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: '800', margin: '0 0 12px 0', lineHeight: '1.1', minHeight: '80px', letterSpacing: '-0.5px' }}>
            {activeDisplayNode ? techDetails[activeDisplayNode].title : "Core Stack Elements"}
          </h2>
          
          <p style={{ fontSize: '0.95rem', color: '#e4e4e7', lineHeight: '1.6', margin: '0 0 25px 0', minHeight: '140px', fontWeight: '500', opacity: 0.9 }}>
            {activeDisplayNode ? (
              <TypewriterText text={techDetails[activeDisplayNode].summary} speed={8} />
            ) : (
              <span>Hover over or click the orbiting 3D system vectors to explore specialized tools across my modern frontend architectural designs, backends, and deployment engines.</span>
            )}
          </p>
          
          <div style={{ borderLeft: '2px solid rgba(168, 85, 247, 0.5)', paddingLeft: '20px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: activeDisplayNode === "React / R3F" || activeDisplayNode === "Three.js / WebGL" ? "#61dafb" : "#ffffff", fontWeight: '700', transition: 'color 0.2s' }}>✦ Optimized GPU Shading (WebGL)</p>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: activeDisplayNode === "Laravel Core" || activeDisplayNode === "Python FastAPI" || activeDisplayNode === "Node.js Engine" ? "#f43f5e" : "#ffffff", fontWeight: '700', transition: 'color 0.2s' }}>✦ Scalable Microservices Pipelines</p>
            <p style={{ margin: '0 0 0 0', fontSize: '0.9rem', color: activeDisplayNode === "Docker / DevOps" ? "#34d399" : "#ffffff", fontWeight: '700', transition: 'color 0.2s' }}>✦ Automated Cloud Infrastructure</p>
          </div>
          <p style={{ marginTop: '35px', fontSize: '0.8rem', color: '#c084fc', letterSpacing: '2px', opacity: 0.8, fontFamily: 'monospace', fontWeight: '700' }}>
            (v) SCROLL DOWN FOR CONTACT
          </p>
        </div>
      </Html>

      {/* 🪐 2. 3D SHIFTED GRAPHICS: 3D ග්‍රැෆික්ස් ටික විතරක් පරණ විදිහටම දකුණට වෙලා ලස්සනට කැරකෙනවා මචන් */}
      <group position={[0.8, -0.2, 0]}> 
        
        {/* SAFE CSS INJECTION */}
        <Html>
          <style>{`
            /* 🌌 ULTRA-CLEAN MOBILE TOP-LEFT COMPACT CARD FIXED */
            @media (max-width: 768px) {
              .tech-card-container { 
                width: 250px !important; 
                max-width: 85vw !important;
                position: absolute !important;
                
                /* 🌟 100% FIXED: 3D ප්‍රොජෙක්ෂන් එකෙන් එලියට ගත්තු නිසා දැන් නූලටම වම් කෙලවරටම ලොක් වෙනවා මචන්! */
                left: 15px !important; 
                top: 15px !important; 
                transform: none !important; 
                
                padding: 18px !important; 
                background: rgba(5, 5, 13, 0.7) !important; 
                backdrop-filter: blur(12px) !important;
                box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2) !important;
              }
              .tech-card-container h2 {
                font-size: 1.35rem !important;
                min-height: auto !important;
                margin-bottom: 6px !important;
              }
              .tech-card-container p {
                font-size: 0.8rem !important;
                min-height: auto !important;
                line-height: 1.4 !important;
                margin-bottom: 12px !important;
              }
              .tech-card-container div {
                margin-top: 8px !important;
              }
              .tech-card-container div p {
                font-size: 0.75rem !important;
                margin-bottom: 4px !important;
              }
            }

            @keyframes holoRipple {
              0% { box-shadow: 0 0px 0px 0px rgba(255, 255, 255, 0.8); transform: scale(1); }
              20% { transform: scale(1.22); }
              40% { box-shadow: 0 0 30px 15px rgba(0, 255, 204, 0); }
              100% { box-shadow: 0 0px 0px 0px rgba(0, 0, 0, 0); transform: scale(1); }
            }
            @keyframes neonPulseAuraRing {
              0% { box-shadow: 0 0 8px rgba(255,255,255,0.15); }
              50% { box-shadow: 0 0 18px var(--pulse-clr), 0 0 5px var(--pulse-clr); }
              100% { box-shadow: 0 0 8px rgba(255,255,255,0.15); }
            }
            .holo-click-reaction { animation: holoRipple 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important; }
            .neon-ambient-glow { animation: neonPulseAuraRing 2s infinite ease-in-out; }
          `}</style>
        </Html>
        
        <QuantumCore activePulse={!!pulsingNode} coreColor={coreColor} />

        {burstData && <ParticleExplosion position={burstData.pos} burstColor={burstData.color} />}

        {/* 🪐 RING 1: FRONTEND ORBIT */}
        <OrbitRing rotationX={Math.PI / 4} rotationY={Math.PI / 6} radius={2.2} speed={0.2}>
          {techNodes.filter(n => n.ring === 1).map((node, idx) => (
            <TechNodeInstance 
              key={idx}
              node={node}
              radius={2.2}
              pulsingNode={pulsingNode}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              onNodeHover={onNodeHover}
              handleNodeClick={handleNodeClick}
            />
          ))}
        </OrbitRing>

        {/* 🚀 RING 2: BACKEND ORBIT */}
        <OrbitRing rotationX={-Math.PI / 3} rotationY={Math.PI / 4} radius={3.4} speed={-0.15}>
          {techNodes.filter(n => n.ring === 2).map((node, idx) => (
            <TechNodeInstance 
              key={idx}
              node={node}
              radius={3.4}
              pulsingNode={pulsingNode}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              onNodeHover={onNodeHover}
              handleNodeClick={handleNodeClick}
            />
          ))}
        </OrbitRing>

        {/* 🐳 RING 3: DEVOPS ORBIT */}
        <OrbitRing rotationX={Math.PI / 2.5} rotationY={-Math.PI / 3} radius={4.6} speed={0.1}>
          {techNodes.filter(n => n.ring === 3).map((node, idx) => (
            <TechNodeInstance 
              key={idx}
              node={node}
              radius={4.6}
              pulsingNode={pulsingNode}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              onNodeHover={onNodeHover}
              handleNodeClick={handleNodeClick}
            />
          ))}
        </OrbitRing>

      </group>
    </group>
  );
};