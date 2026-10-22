"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { BufferGeometry, Float32BufferAttribute, Group, Vector3 } from "three";
import { reachLocations } from "@/content/global-reach";

// A single regular sample per land point keeps the reference's crisp dot pattern.
const vertex = `varying float alpha; uniform float pixelRatio; uniform float dotScale;
void main(){vec4 p=modelViewMatrix*vec4(position,1.); float facing=dot(normalize(normalMatrix*position),normalize(-p.xyz));
alpha=smoothstep(0.,.25,facing)*(.45+.55*max(0.,facing)); gl_PointSize=pixelRatio*dotScale*clamp(17./-p.z,1.3,3.); gl_Position=projectionMatrix*p;}`;
const fragment = `varying float alpha; void main(){float d=length(gl_PointCoord-.5); if(d>.5)discard;
gl_FragColor=vec4(.12,.14,.17,alpha*(1.-smoothstep(.32,.5,d)));}`;
const surfaceVertex = `varying vec3 n; varying vec3 eye; void main(){vec4 p=modelViewMatrix*vec4(position,1.); n=normalize(normalMatrix*normal); eye=normalize(-p.xyz); gl_Position=projectionMatrix*p;}`;
const surfaceFragment = `varying vec3 n; varying vec3 eye; void main(){float edge=pow(1.-max(0.,dot(normalize(n),normalize(eye))),2.); gl_FragColor=vec4(mix(vec3(.985),vec3(.92,.925,.935),edge),1.);}`;
type MapProps = {
  data: number[];
  still: boolean;
  selectedOffice: number;
  labels: RefObject<SVGSVGElement | null>;
};
// Demand rendering separates the decorative globe from the scroll frame rate.
// The GPU draws at most 30 times per second and stops completely when hidden.
function RenderBudget({ running }: { running: boolean }) {
  const invalidate = useThree((state) => state.invalidate);
  const setDpr = useThree((state) => state.setDpr);
  const size = useThree((state) => state.size);
  const currentDpr = useThree((state) => state.viewport.dpr);
  useEffect(() => {
    // Cap both density and total pixels, including ultrawide/high-DPI displays.
    const target = Math.min(
      1,
      Math.sqrt(1_400_000 / Math.max(1, size.width * size.height)),
    );
    if (Math.abs(currentDpr - target) > 0.001) setDpr(target);
    invalidate();
  }, [size.width, size.height, currentDpr, setDpr, invalidate]);
  useEffect(() => {
    if (!running) return;
    let request = 0;
    let previous = 0;
    const tick = (now: number) => {
      if (now - previous >= 1000 / 30) {
        previous = now - ((now - previous) % (1000 / 30));
        invalidate();
      }
      request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [running, invalidate]);
  return null;
}

function Globe({
  data,
  still,
  selectedOffice,
  labels,
  moving,
  onSettled,
}: MapProps & { moving: boolean; onSettled: () => void }) {
  const earth = useRef<Group>(null);
  const clock = useRef(0);
  const lastStamp = useRef(0);
  const renderer = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [selectedOffice, still, invalidate]);
  const size = useThree((state) => state.size);
  const pixelRatio = useThree((state) => state.viewport.dpr);
  const compact = size.width <= 900;
  const rotation = useRef((-reachLocations[0].longitude * Math.PI) / 180);
  const tilt = useRef((reachLocations[0].latitude * Math.PI) / 180);
  const annotations = useRef<
    { root: SVGGElement; leader: SVGPathElement; label: SVGGElement }[]
  >([]);
  useEffect(() => {
    annotations.current = Array.from(
      labels.current?.querySelectorAll<SVGGElement>("[data-location]") || [],
    ).map((root) => ({
      root,
      leader: root.querySelector<SVGPathElement>("path")!,
      label: root.querySelector<SVGGElement>(".reach-location-label")!,
    }));
  }, [labels]);
  const uniforms = useMemo(
    () => ({
      pixelRatio: { value: pixelRatio },
      dotScale: { value: compact ? 0.7 : 1 },
    }),
    [pixelRatio, compact],
  );
  const geometry = useMemo(() => {
    const positions: number[] = [];
    let land = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 0.5) continue;
      // Fewer samples at small sizes keep distinct dots instead of a dark mass.
      if (compact && land++ % 2) continue;
      positions.push(data[i] * 2.405, data[i + 1] * 2.405, data[i + 2] * 2.405);
    }
    const result = new BufferGeometry();
    result.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return result;
  }, [data, compact]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const pins = useMemo(
    () =>
      reachLocations.map((location) => {
        const lat = (location.latitude * Math.PI) / 180,
          lon = (location.longitude * Math.PI) / 180;
        return new Vector3(
          Math.cos(lat) * Math.sin(lon) * 2.42,
          Math.sin(lat) * 2.42,
          Math.cos(lat) * Math.cos(lon) * 2.42,
        );
      }),
    [],
  );
  const world = useMemo(() => new Vector3(), []);
  const projected = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    if (!earth.current) return;
    if (!still && moving) clock.current += Math.min(delta, 0.05);
    const target = (-reachLocations[selectedOffice].longitude * Math.PI) / 180;
    const latitude = (reachLocations[selectedOffice].latitude * Math.PI) / 180;
    const difference = Math.atan2(
      Math.sin(target - rotation.current),
      Math.cos(target - rotation.current),
    );
    const latitudeDifference = latitude - tilt.current;
    const ease = still ? 1 : 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    rotation.current += difference * ease;
    tilt.current += latitudeDifference * ease;
    earth.current.rotation.set(tilt.current, rotation.current, 0);
    const settled =
      still || Math.abs(difference) + Math.abs(latitudeDifference) < 0.001;
    renderer.domElement.dataset.motion = settled ? "settled" : "moving";
    renderer.domElement.dataset.office = reachLocations[selectedOffice].name;
    if ((settled || still) && moving) onSettled();
    earth.current.updateWorldMatrix(true, false);
    pins.forEach((pin, index) => {
      const annotation = annotations.current[index];
      if (!annotation) return;
      world.copy(pin);
      earth.current!.localToWorld(world);
      const front = camera.position.dot(world) - world.lengthSq() > 0.15;
      annotation.root.style.opacity = front ? "1" : "0";
      annotation.label.style.opacity = index === selectedOffice ? "1" : "0";
      annotation.leader.style.opacity = index === selectedOffice ? "1" : "0";
      annotation.root.dataset.facing = front ? "front" : "back";
      projected.copy(world).project(camera);
      const x = (projected.x * 0.5 + 0.5) * size.width,
        y = (-projected.y * 0.5 + 0.5) * size.height;
      const labelWidth = reachLocations[index].name.length * 6.3 + 18;
      // The map now has its own panel; only the selected office needs a label.
      const lx =
        Math.max(
          12,
          Math.min(size.width - labelWidth - 12, x - labelWidth / 2),
        ) - x;
      const ly = 18;
      annotation.root.setAttribute(
        "transform",
        `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
      );
      annotation.leader.setAttribute(
        "d",
        `M0 0L${lx + labelWidth / 2} ${ly + 12}`,
      );
      annotation.label.setAttribute("transform", `translate(${lx} ${ly})`);
    });
    if (
      clock.current - lastStamp.current > 0.45 ||
      !renderer.domElement.dataset.rotation
    ) {
      renderer.domElement.dataset.rotation = clock.current.toFixed(3);
      lastStamp.current = clock.current;
    }
  });
  return (
    <group
      ref={earth}
      rotation={[
        (reachLocations[0].latitude * Math.PI) / 180,
        (-reachLocations[0].longitude * Math.PI) / 180,
        0,
      ]}
    >
      <mesh>
        <sphereGeometry args={[2.392, 48, 32]} />
        <shaderMaterial
          vertexShader={surfaceVertex}
          fragmentShader={surfaceFragment}
        />
      </mesh>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
export default function ReachGlobeScene({
  data,
  visible,
  still,
  fallback,
  onReady,
  selectedOffice,
  labels,
}: MapProps & {
  visible: boolean;
  fallback: ReactNode;
  onReady: () => void;
}) {
  const [moving, setMoving] = useState(true);
  useEffect(() => setMoving(!still), [selectedOffice, still]);
  return (
    <Boundary fallback={fallback}>
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 7.35], fov: 39 }}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        onCreated={onReady}
      >
        <RenderBudget running={visible && !still && moving} />
        <Globe
          data={data}
          still={still}
          selectedOffice={selectedOffice}
          labels={labels}
          moving={moving}
          onSettled={() => setMoving(false)}
        />
      </Canvas>
    </Boundary>
  );
}
