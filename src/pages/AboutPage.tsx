import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Target, Mail, Linkedin, Github, Twitter } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const stats = [
    { icon: Globe, number: '195+', label: 'Countries Analyzed' },
    { icon: Users, number: '50K+', label: 'Users Worldwide' },
    { icon: Award, number: '25+', label: 'Awards Received' },
    { icon: Target, number: '99.9%', label: 'Data Accuracy' },
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Lead Researcher & Founder',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      bio: 'PhD in Environmental Engineering with 15+ years in water resource management.',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Michael Rodriguez',
      role: 'Senior GIS Developer',
      image: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg',
      bio: 'Expert in 3D visualization and geospatial data analysis with a focus on interactive mapping.',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Data Science Director',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
      bio: 'Specialist in machine learning applications for environmental data and predictive modeling.',
      social: { linkedin: '#', twitter: '#', github: '#' }
    },
  ];

  const values = [
    {
      title: 'Data Transparency',
      description: 'We believe in open, accessible data that empowers informed decision-making about global water resources.',
    },
    {
      title: 'Scientific Accuracy',
      description: 'Our visualizations are built on rigorous scientific research and validated data sources.',
    },
    {
      title: 'Global Impact',
      description: 'We aim to contribute to sustainable water management practices worldwide through technology.',
    },
    {
      title: 'Innovation',
      description: 'We continuously explore cutting-edge visualization techniques to make complex data understandable.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-800">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About AquaFlow
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              We're dedicated to visualizing global water resources through cutting-edge 3D technology, 
              making complex groundwater data accessible and actionable for researchers, policymakers, and the public.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                AquaFlow was born from the urgent need to understand and visualize global groundwater patterns. 
                As water scarcity becomes an increasingly critical issue, we recognized that complex data needed 
                to be transformed into intuitive, actionable insights.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our platform combines advanced 3D visualization technology with comprehensive datasets to create 
                an unprecedented view of global water flows, empowering users to make informed decisions about 
                water resource management and policy.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg"
                alt="Global water visualization"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our commitment to excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate experts dedicated to advancing water resource visualization and analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.github}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Interested in collaborating or have questions about our platform? We'd love to hear from you.
            </p>
            <button className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};