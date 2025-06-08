import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Search, Tag, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
}

export const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Understanding Global Groundwater Depletion Patterns',
      excerpt: 'A comprehensive analysis of groundwater extraction trends across different continents and their environmental impact.',
      content: 'Full article content here...',
      author: 'Dr. Sarah Chen',
      date: '2025-01-15',
      readTime: '8 min read',
      category: 'Research',
      tags: ['Groundwater', 'Environment', 'Sustainability'],
      image: 'https://images.pexels.com/photos/1181189/pexels-photo-1181189.jpeg',
      featured: true,
    },
    {
      id: 2,
      title: 'Advanced 3D Visualization Techniques for Water Data',
      excerpt: 'Exploring cutting-edge methods for visualizing complex water flow data in three-dimensional space.',
      content: 'Full article content here...',
      author: 'Michael Rodriguez',
      date: '2025-01-12',
      readTime: '6 min read',
      category: 'Technology',
      tags: ['3D Visualization', 'GIS', 'Data Science'],
      image: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg',
      featured: false,
    },
    {
      id: 3,
      title: 'Water Security Challenges in the 21st Century',
      excerpt: 'Examining the growing challenges of water security and the role of technology in sustainable water management.',
      content: 'Full article content here...',
      author: 'Dr. Emily Watson',
      date: '2025-01-10',
      readTime: '10 min read',
      category: 'Policy',
      tags: ['Water Security', 'Policy', 'Sustainability'],
      image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      featured: false,
    },
    {
      id: 4,
      title: 'Machine Learning Applications in Water Resource Management',
      excerpt: 'How artificial intelligence and machine learning are revolutionizing water resource prediction and management.',
      content: 'Full article content here...',
      author: 'Dr. James Liu',
      date: '2025-01-08',
      readTime: '7 min read',
      category: 'Technology',
      tags: ['Machine Learning', 'AI', 'Water Management'],
      image: 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg',
      featured: true,
    },
  ];

  const categories = ['All', 'Research', 'Technology', 'Policy'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Water Insights Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest research, technology, and insights in global water resource management
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium">{post.author}</div>
                      <div className="flex items-center gap-2">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-500">No articles found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};