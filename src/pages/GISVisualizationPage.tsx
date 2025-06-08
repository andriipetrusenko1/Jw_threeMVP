import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Globe, Play, Pause, RotateCcw, Settings, Info, Download, Menu, X, TrendingUp, Droplets, MapPin, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    {
      id: 6,
      source: { country: 'Canada', lat: 56.1304, lng: -106.3468 },
      destination: { country: 'United States', lat: 39.8283, lng: -98.5795 },
      volume: 2600000,
      timestamp: '2025-01-15T00:00:00Z'
    },
    {
      id: 7,
      source: { country: 'Australia', lat: -25.2744, lng: 133.7751 },
      destination: { country: 'Indonesia', lat: -0.7893, lng: 113.9213 },
      volume: 1200000,
      timestamp: '2025-01-15T00:00:00Z'
    },
  ];

  // Aggregated data for dashboard
  const totalVolume = waterFlowData.reduce((sum, flow) => sum + flow.volume, 0);
  const topSources = waterFlowData
    .reduce((acc, flow) => {
      const existing = acc.find(item => item.country === flow.source.country);
      if (existing) {
        existing.volume += flow.volume;
      } else {
        acc.push({ country: flow.source.country, volume: flow.volume });
      }
      return acc;
    }, [] as { country: string; volume: number }[])
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  const regionData = [
    { name: 'North America', value: 35, volume: 4100000 },
    { name: 'Asia', value: 28, volume: 6000000 },
    { name: 'South America', value: 22, volume: 1800000 },
    { name: 'Europe', value: 10, volume: 2100000 },
    { name: 'Oceania', value: 5, volume: 1200000 },
  ];

  const timeSeriesData = [
    { time: '00:00', volume: 2400 },
    { time: '04:00', volume: 1398 },
    { time: '08:00', volume: 9800 },
    { time: '12:00', volume: 3908 },
    { time: '16:00', volume: 4800 },
    { time: '20:00', volume: 3800 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{value}</div>
          <div className="text-xs text-gray-300">{subtitle}</div>
        </div>
      </div>
      <div className="text-sm text-gray-300">{title}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 relative flex">
      {/* Main Visualization Area */}
      <div className={`flex-1 relative transition-all duration-300 ${showSidebar && !isMobile ? 'mr-80' : ''}`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/20 backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-400" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    3D Water Flow Visualization
                  </h1>
                  <p className="text-blue-200 text-sm hidden sm:block">
                    Interactive visualization of global groundwater flows
                  </p>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  {showSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  {isMobile ? '' : (showSidebar ? 'Hide' : 'Show')} Dashboard
                </button>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                
                <button
                  onClick={resetView}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3D Visualization */}
        <div ref={mountRef} className="w-full h-screen" />

        {/* Mobile Info Panel */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 text-white"
          >
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-blue-400">{waterFlowData.length}</div>
                <div className="text-gray-300">Active Flows</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {(totalVolume / 1000000).toFixed(1)}M
                </div>
                <div className="text-gray-300">Total Volume (L)</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Side Dashboard */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: isMobile ? '100%' : 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isMobile ? '100%' : 320, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`${
              isMobile 
                ? 'fixed inset-y-0 right-0 w-full bg-gray-900 z-50' 
                : 'fixed right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-md'
            } border-l border-gray-700 overflow-y-auto`}
          >
            <div className="p-6 space-y-6">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Analytics Dashboard</h2>
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  title="Total Volume"
                  value={`${(totalVolume / 1000000).toFixed(1)}M L`}
                  subtitle="Liters"
                  icon={Droplets}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Active Flows"
                  value={waterFlowData.length}
                  subtitle="Connections"
                  icon={Activity}
                  color="bg-green-500"
                />
                <StatCard
                  title="Countries"
                  value={new Set([...waterFlowData.map(f => f.source.country), ...waterFlowData.map(f => f.destination.country)]).size}
                  subtitle="Involved"
                  icon={MapPin}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Avg Flow"
                  value={`${(totalVolume / waterFlowData.length / 1000000).toFixed(1)}M L`}
                  subtitle="Per Route"
                  icon={TrendingUp}
                  color="bg-orange-500"
                />
              </div>

              {/* Top Sources Chart */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Top Source Countries</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topSources}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="country" 
                      stroke="#9CA3AF" 
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                      formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M L`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Regional Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                      labelStyle={{ fontSize: '10px', fill: '#F9FAFB' }}
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Time Series */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">24h Flow Trend</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
                    <YAxis stroke="#9CA3AF" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151', 
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Flow List */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4">Active Flows</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {waterFlowData.slice(0, 5).map((flow) => (
                    <div key={flow.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                      <div className="text-sm">
                        <div className="text-white font-medium">{flow.source.country}</div>
                        <div className="text-gray-400 text-xs">→ {flow.destination.country}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-400 font-semibold text-sm">
                          {(flow.volume / 1000000).toFixed(1)}M L
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                Export Dashboard Data
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Panel */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 text-white z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Visualization Controls</h3>
            <button
              onClick={() => setShowControls(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
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