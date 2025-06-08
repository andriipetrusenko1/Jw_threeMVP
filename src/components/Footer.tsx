import React from 'react';
import { Droplets, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AquaFlow</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Visualizing global groundwater flows and providing insights into water resource management 
              through advanced 3D GIS technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/visualization" className="text-gray-300 hover:text-white transition-colors">GIS Visualization</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 AquaFlow. All rights reserved. Built with modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};