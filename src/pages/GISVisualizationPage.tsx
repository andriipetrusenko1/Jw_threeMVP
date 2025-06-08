import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Globe, Play, Pause, RotateCcw, Settings, Info, Download } from 'lucide-react';

interface WaterFlowData {
  id: number;
  source: {
    country: string;
    lat: number;
    lng: number;
  };
  destination: {
    country: string;
    lat: number;
    lng: number;
  };
  volume: number;
  timestamp: string;
}

export const GISVisualizationPage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<WaterFlowData | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Mock data for water flows
  const waterFlowData: WaterFlowData[] = [
    {
      id: 1,
      source: { country: 'United States', lat: 39.8283, lng: -98.5795 },
      destination: { country: 'Mexico', lat: 23.6345, lng: -102.5528 },
      volume: 1500000,
      timestamp: '2025-01-15T00:00:00Z'
    },
    {
      id: 2,
      source: { country: 'India', lat: 20.5937, lng: 78.9629 },
      destination: { country: 'Bangladesh', lat: 23.6850, lng: 90.3563 },
      volume: 2800000,
      timestamp: '2025-01-15T00:00:00Z'
    },
    {
      id: 3,
      source: { country: 'China', lat: 35.8617, lng: 104.1954 },
      destination: { country: 'Vietnam', lat: 14.0583, lng: 108.2772 },
      volume: 3200000,
      timestamp: '2025-01-15T00:00:00Z'
    },
    {
      id: 4,
      source: { country: 'Brazil', lat: -14.2350, lng: -51.9253 },
      destination: { country: 'Argentina', lat: -38.4161, lng: -63.6167 },
      volume: 1800000,
      timestamp: '2025-01-15T00:00:00Z'
    },
    {
      id: 5,
      source: { country: 'Russia', lat: 61.5240, lng: 105.3188 },
      destination: { country: 'Kazakhstan', lat: 48.0196, lng: 66.9237 },
      volume: 2100000,
      timestamp: '2025-01-15T00:00:00Z'
    },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthTexture = new THREE.TextureLoader().load('/api/placeholder/2048/1024');
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 0.5,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);

    // Create atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create water flow arcs
    const createArc = (start: THREE.Vector3, end: THREE.Vector3, volume: number) => {
      const distance = start.distanceTo(end);
      const height = Math.max(0.3, distance * 0.5);
      
      // Create arc curve
      const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
      mid.normalize().multiplyScalar(1 + height);
      
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      
      // Create tube geometry for the arc
      const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.005 + (volume / 10000000) * 0.02, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6 - (volume / 5000000) * 0.3, 0.8, 0.6),
        transparent: true,
        opacity: 0.8,
      });
      
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);

      // Animated particles along the arc
      const particleCount = Math.floor(volume / 500000);
      for (let i = 0; i < Math.min(particleCount, 10); i++) {
        const particleGeometry = new THREE.SphereGeometry(0.002, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.8,
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const t = (i / particleCount) + (Math.random() * 0.1);
        const position = curve.getPoint(t % 1);
        particle.position.copy(position);
        
        scene.add(particle);
        
        // Animate particle
        const animateParticle = () => {
          const time = Date.now() * 0.001;
          const progress = ((time * 0.1 + i * 0.1) % 1);
          const newPosition = curve.getPoint(progress);
          particle.position.copy(newPosition);
        };
        
        const animate = () => {
          if (isPlaying) {
            animateParticle();
          }
          requestAnimationFrame(animate);
        };
        animate();
      }
    };

    // Convert lat/lng to 3D coordinates
    const latLngToVector3 = (lat: number, lng: number, radius = 1) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Create arcs for each water flow
    waterFlowData.forEach(flow => {
      const startPos = latLngToVector3(flow.source.lat, flow.source.lng);
      const endPos = latLngToVector3(flow.destination.lat, flow.destination.lng);
      createArc(startPos, endPos, flow.volume);

      // Add markers for source and destination
      const markerGeometry = new THREE.SphereGeometry(0.01, 16, 16);
      const sourceMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
      const destMaterial = new THREE.MeshBasicMaterial({ color: 0x44ff44 });
      
      const sourceMarker = new THREE.Mesh(markerGeometry, sourceMaterial);
      const destMarker = new THREE.Mesh(markerGeometry, destMaterial);
      
      sourceMarker.position.copy(startPos.multiplyScalar(1.01));
      destMarker.position.copy(endPos.multiplyScalar(1.01));
      
      scene.add(sourceMarker);
      scene.add(destMarker);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (isPlaying) {
        earth.rotation.y += 0.001;
        atmosphere.rotation.y += 0.0015;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / 100;
      mouseY = (event.clientY - window.innerHeight / 2) / 100;
      targetRotationX = mouseY * 0.05;
      targetRotationY = mouseX * 0.05;
    };

    const updateRotation = () => {
      earth.rotation.x += (targetRotationX - earth.rotation.x) * 0.05;
      earth.rotation.y += (targetRotationY - earth.rotation.y) * 0.05;
      requestAnimationFrame(updateRotation);
    };

    document.addEventListener('mousemove', onMouseMove);
    updateRotation();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPlaying]);

  const resetView = () => {
    if (sceneRef.current) {
      const earth = sceneRef.current.getObjectByName('earth');
      if (earth) {
        earth.rotation.set(0, 0, 0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-400" />
                3D Water Flow Visualization
              </h1>
              <p className="text-blue-200">
                Interactive visualization of global groundwater extraction flows
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={resetView}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              
              <button
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                Controls
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3D Visualization */}
      <div ref={mountRef} className="w-full h-screen" />

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-32 right-4 bg-black/80 backdrop-blur-md rounded-2xl p-6 max-w-sm text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Visualization Guide</h3>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Source Countries</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Destination Countries</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded"></div>
            <span>Water Flow Arcs</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span>Flow Particles</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-600">
          <p className="text-xs text-gray-300">
            Mouse: Rotate view • Arc thickness represents flow volume
          </p>
        </div>
      </motion.div>

      {/* Data Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Active Water Flows</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{waterFlowData.length}</div>
                <div className="text-gray-300">Active Flows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {(waterFlowData.reduce((sum, flow) => sum + flow.volume, 0) / 1000000).toFixed(1)}M
                </div>
                <div className="text-gray-300">Total Volume (L)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {new Set(waterFlowData.map(f => f.source.country)).size}
                </div>
                <div className="text-gray-300">Source Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {new Set(waterFlowData.map(f => f.destination.country)).size}
                </div>
                <div className="text-gray-300">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">Real-time</div>
                <div className="text-gray-300">Data Status</div>
              </div>
            </div>
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>
      </motion.div>

      {/* Controls Panel */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 text-white z-20"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Visualization Controls</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Animation Speed</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                defaultValue="1"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Flow Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                defaultValue="0.8"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Particle Count</label>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                defaultValue="10"
                className="w-full"
              />
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Apply Changes
              </button>
              <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors">
                Reset Defaults
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};