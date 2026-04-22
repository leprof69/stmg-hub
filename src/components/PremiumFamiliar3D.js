import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const COLORS = {
  body: "#F97316",
  belly: "#FED7AA",
  wing: "#FB923C",
  crest: "#FACC15",
  beak: "#F59E0B",
  eye: "#111827",
  angry: "#DC2626",
  sad: "#60A5FA",
};

function PhoenixKawaii({ mood = "neutre", stage = "bebe", roaming = false }) {
  const root = useRef(null);
  const head = useRef(null);
  const leftWing = useRef(null);
  const rightWing = useRef(null);
  const eyeLeft = useRef(null);
  const eyeRight = useRef(null);
  const browLeft = useRef(null);
  const browRight = useRef(null);
  const mouth = useRef(null);
  const lookTarget = useRef({ x: 0, y: 0 });

  const scalesByStage = useMemo(
    () => ({
      oeuf: 0.88,
      bebe: 1,
      ado: 1.1,
      adulte: 1.2,
    }),
    []
  );

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    const stageScale = scalesByStage[stage] || 1;
    lookTarget.current.x = pointer.x || 0;
    lookTarget.current.y = pointer.y || 0;

    if (!root.current) return;
    if (stage === "oeuf") {
      root.current.position.y = Math.sin(t * 1.5) * 0.06 - 0.1;
      root.current.rotation.z = Math.sin(t * 1.3) * 0.05;
      root.current.scale.setScalar(stageScale);
      return;
    }

    const baseBob = Math.sin(t * 2) * 0.07;
    const jump = roaming ? Math.max(0, Math.sin(t * 2.9)) * 0.22 : 0;
    const moodBoost = mood === "heureux" ? 1.18 : mood === "colere" ? 1.3 : 1;
    root.current.position.y = baseBob * moodBoost + jump;
    root.current.rotation.z = Math.sin(t * 1.1) * (mood === "triste" ? 0.035 : 0.06);
    root.current.scale.setScalar(stageScale);

    if (head.current) {
      const headSwing = Math.sin(t * 1.35) * 0.35;
      const lookX = lookTarget.current.x * 0.35;
      const lookY = lookTarget.current.y * 0.2;
      head.current.rotation.y = (mood === "triste" ? headSwing * 0.45 : headSwing * 0.7) + lookX;
      head.current.rotation.x = (mood === "triste" ? 0.22 : mood === "colere" ? -0.1 : 0.03) - lookY;
    }

    if (leftWing.current && rightWing.current) {
      const flapFreq = mood === "heureux" ? 8 : mood === "colere" ? 10 : 6;
      const flap = Math.sin(t * flapFreq) * (mood === "triste" ? 0.2 : 0.5);
      leftWing.current.rotation.z = -0.35 - Math.abs(flap);
      rightWing.current.rotation.z = 0.35 + Math.abs(flap);
    }

    if (eyeLeft.current && eyeRight.current) {
      const blink = Math.abs(Math.sin(t * 2.7)) < 0.06 ? 0.12 : 1;
      eyeLeft.current.scale.y = blink;
      eyeRight.current.scale.y = blink;
    }

    if (browLeft.current && browRight.current) {
      if (mood === "colere") {
        browLeft.current.rotation.z = -0.5;
        browRight.current.rotation.z = 0.5;
      } else if (mood === "triste") {
        browLeft.current.rotation.z = 0.22;
        browRight.current.rotation.z = -0.22;
      } else {
        browLeft.current.rotation.z = -0.1 + Math.sin(t * 1.8) * 0.04;
        browRight.current.rotation.z = 0.1 - Math.sin(t * 1.8) * 0.04;
      }
    }

    if (mouth.current) {
      if (mood === "heureux") {
        mouth.current.scale.set(1.25, 1.2, 1);
      } else if (mood === "triste") {
        mouth.current.scale.set(1, 0.7, 1);
      } else if (mood === "colere") {
        mouth.current.scale.set(0.8, 1.4, 1);
      } else {
        mouth.current.scale.set(1, 1, 1);
      }
    }
  });

  if (stage === "oeuf") {
    return (
      <group ref={root}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.45} metalness={0.02} />
        </mesh>
        <mesh position={[0.1, 0.23, 0.56]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#E5E7EB" />
        </mesh>
      </group>
    );
  }

  const eyeColor = mood === "colere" ? COLORS.angry : mood === "triste" ? COLORS.sad : COLORS.eye;

  return (
    <group ref={root}>
      <mesh castShadow position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial color={COLORS.body} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.08, 0.47]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={COLORS.belly} roughness={0.4} />
      </mesh>

      <group ref={leftWing} position={[-0.58, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshStandardMaterial color={COLORS.wing} />
        </mesh>
      </group>
      <group ref={rightWing} position={[0.58, 0.2, 0]} rotation={[0, 0, 0.5]}>
        <mesh castShadow>
          <sphereGeometry args={[0.31, 24, 24]} />
          <meshStandardMaterial color={COLORS.wing} />
        </mesh>
      </group>

      <group ref={head} position={[0, 0.72, 0.24]}>
        <mesh castShadow>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshStandardMaterial color={COLORS.body} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <coneGeometry args={[0.13, 0.26, 12]} />
          <meshStandardMaterial color={COLORS.crest} />
        </mesh>
        <mesh position={[0, -0.02, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.25, 12]} />
          <meshStandardMaterial color={COLORS.beak} />
        </mesh>
        <mesh ref={eyeLeft} position={[-0.13, 0.07, 0.32]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
        <mesh ref={eyeRight} position={[0.13, 0.07, 0.32]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={eyeColor} />
        </mesh>
        <mesh ref={browLeft} position={[-0.14, 0.16, 0.33]}>
          <boxGeometry args={[0.11, 0.02, 0.02]} />
          <meshStandardMaterial color={COLORS.eye} />
        </mesh>
        <mesh ref={browRight} position={[0.14, 0.16, 0.33]}>
          <boxGeometry args={[0.11, 0.02, 0.02]} />
          <meshStandardMaterial color={COLORS.eye} />
        </mesh>
        <mesh ref={mouth} position={[0, -0.11, 0.35]}>
          <torusGeometry args={[0.06, 0.012, 8, 24, Math.PI]} />
          <meshStandardMaterial color={mood === "colere" ? COLORS.angry : "#111827"} />
        </mesh>
      </group>

      <mesh position={[0, -0.57, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.22, 0.52, 14]} />
        <meshStandardMaterial color={COLORS.crest} />
      </mesh>
    </group>
  );
}

export default function PremiumFamiliar3D({
  pet,
  compact = false,
}) {
  const width = compact ? 82 : 230;
  const height = compact ? 82 : 190;
  const cameraPos = compact ? [0, 0.65, 3.1] : [0, 0.8, 3.6];

  return (
    <div style={{ width: `${width}px`, height: `${height}px`, borderRadius: compact ? "16px" : "18px", overflow: "hidden", background: "transparent", pointerEvents: "auto" }}>
      <Canvas
        shadows
        camera={{ position: cameraPos, fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight intensity={1.15} position={[3, 4, 2]} castShadow />
        <pointLight intensity={0.45} position={[-2, 1.5, 3]} />
        <PhoenixKawaii mood={pet?.mood} stage={pet?.stage} roaming={Boolean(pet?.isRoaming)} />
      </Canvas>
    </div>
  );
}

