import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeStar({ className = "w-28 h-28", size = 1, rotationSpeed = 0.008 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = currentMount.clientWidth || 120;
    const height = currentMount.clientHeight || 120;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.4;

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.domElement.style.touchAction = 'pan-y';
    currentMount.appendChild(renderer.domElement);

    // 4-pointed 3D Star Geometry
    const shape = new THREE.Shape();
    const points = 4;
    const outerRadius = 1.1 * size;
    const innerRadius = 0.35 * size;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.3 * size,
      bevelEnabled: true,
      bevelThickness: 0.2 * size,
      bevelSize: 0.15 * size,
      bevelOffset: 0,
      bevelSegments: 4
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Chrome Metallic Material
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.12,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa5c4ff, 1.8);
    dirLight2.position.set(-4, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfff0dd, 2, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
      targetRotationY = mouseX * 0.8;
      targetRotationX = mouseY * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle spin & float
      mesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.15;
      mesh.rotation.y += rotationSpeed + (targetRotationY - mesh.rotation.y) * 0.05;
      mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05 + Math.cos(elapsedTime * 0.7) * 0.003;
      mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [size, rotationSpeed]);

  return <div ref={mountRef} style={{ touchAction: 'pan-y' }} className={`${className} cursor-grab active:cursor-grabbing pointer-events-auto touch-pan-y`} />;
}
