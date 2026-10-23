"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Color, Vector3 } from "three";
import { Component, useMemo, type ReactNode } from "react";
import {
  trailPulseColors,
  trailPulseDelay,
  trailPulseDuration,
  trailPulseLength,
  trailPulseOpacity,
} from "./trail-pulses";

// Original screenshot geometry. Animate material color and brightness, so the
// ribbon silhouettes, spacing and thickness stay exactly in their set pose.
function RibbonTrails({ still }: { still: boolean }) {
  const time = useMemo(() => ({ value: 1.6 }), []);
  const curves = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const side = i < 20 ? 1 : -1;
        const offset = (i % 20) / 20;
        return new CatmullRomCurve3([
          new Vector3(-10, side * (4 + offset * 2), -offset * 2),
          new Vector3(-5, side * (2 + offset), -offset),
          new Vector3(0, side * (0.08 + offset * 0.18), offset * 0.4),
          new Vector3(5, side * (2 + offset), -offset),
          new Vector3(10, side * (4 + offset * 2), -offset * 2),
        ]);
      }),
    [],
  );
  useFrame((_, delta) => {
    if (!still) time.value += Math.min(delta, 0.06);
  });
  return (
    <group rotation={[0.1, 0, 0]}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry
            args={[curve, 100, i % 5 === 0 ? 0.017 : 0.007, 4, false]}
          />
          <meshBasicMaterial
            color={i % 5 === 0 ? "#979797" : "#b8b8b8"}
            transparent
            opacity={i % 5 === 0 ? 0.3 : 0.14}
            depthWrite={false}
            onBeforeCompile={(shader) => {
              shader.uniforms.uPulseTime = time;
              const pulseIndex = Math.floor(i / 5);
              shader.uniforms.uPulseDuration = {
                value: trailPulseDuration(pulseIndex),
              };
              shader.uniforms.uPulseDelay = {
                value: trailPulseDelay(pulseIndex),
              };
              shader.uniforms.uPulseEnabled = { value: i % 5 === 0 ? 1 : 0 };
              shader.uniforms.uPulseColor = {
                value: new Color(trailPulseColors[pulseIndex % 4]),
              };
              shader.vertexShader =
                `varying float vTrailPosition;\n${shader.vertexShader}`.replace(
                  "#include <begin_vertex>",
                  "#include <begin_vertex>\nvTrailPosition = uv.x;",
                );
              shader.fragmentShader =
                `uniform float uPulseTime;\nuniform float uPulseDuration;\nuniform float uPulseDelay;\nuniform float uPulseEnabled;\nuniform vec3 uPulseColor;\nvarying float vTrailPosition;\n${shader.fragmentShader}`.replace(
                  "#include <color_fragment>",
                  `#include <color_fragment>
              // Mirror each curve at its midpoint: the solid footer-style
              // streaks travel inward from both ends of both ribbon bundles.
              float along = abs(vTrailPosition - 0.5) * 2.0;
              // Each arm is half a full path, so double both normalized speed
              // and dash length to retain the footer's physical proportions.
              float packet = fract(along + 2.0 * (uPulseTime - uPulseDelay) / uPulseDuration);
              float edge = max(fwidth(along), 0.0002);
              float pulse = (1.0 - smoothstep(${trailPulseLength * 2} - edge, ${trailPulseLength * 2} + edge, packet)) * uPulseEnabled;
              diffuseColor.rgb = mix(diffuseColor.rgb, uPulseColor, pulse);
              diffuseColor.a = mix(diffuseColor.a, ${trailPulseOpacity}, pulse);
            `,
                );
            }}
          />
        </mesh>
      ))}
    </group>
  );
}
class EnergyBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  // The static screenshot ribbon layer remains visible when WebGL is unavailable.
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function HeroEnergyScene({
  still,
  visible,
}: {
  still: boolean;
  visible: boolean;
}) {
  return (
    <EnergyBoundary>
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 10], fov: 44 }}
        frameloop={still || !visible ? "demand" : "always"}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <RibbonTrails still={still} />
      </Canvas>
    </EnergyBoundary>
  );
}
