import { useState } from 'react';
import Image from 'next/image';

export default function ArthaFutureLanding() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
    alert('Welcome to Artha Investments! You\'ll receive our latest insights and investment guides.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-indigo-900 text-2xl font-bold">Artha Investments</div>
          <div className="hidden md:flex space-x-8">
            <a href="#learn" className="text-indigo-700 hover:text-indigo-500 transition-colors">Learn</a>
            <a href="#content" className="text-indigo-700 hover:text-indigo-500 transition-colors">Content</a>
            <a href="#about" className="text-indigo-700 hover:text-indigo-500 transition-colors">About</a>
            <a href="#contact" className="text-indigo-700 hover:text-indigo-500 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Investing Made
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Simple</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Learn to invest in Indian markets with confidence. From ETFs to stocks, 
            we break down complex concepts into simple, actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
              Start Learning Free
            </button>
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300">
              Watch Our Videos
            </button>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Indian Investors</h2>
          <p className="text-lg text-gray-600">Whether you're in India or abroad, we've got you covered</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Retail Investors & Young Professionals</h3>
            <p className="text-gray-600 text-center">Perfect for those starting their investment journey in India. Learn about SIPs, mutual funds, and building a solid portfolio.</p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">NRIs (US, UK, etc.)</h3>
            <p className="text-gray-600 text-center">Stay connected to Indian markets from abroad. Understand FPI regulations, NRI investment options, and global portfolio diversification.</p>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section id="learn" className="container mx-auto px-6 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey</h2>
          <p className="text-lg text-gray-600">Start from the basics and build your investment knowledge step by step</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Start with ETFs</h3>
            <p className="text-gray-600">Learn about index funds, sector ETFs, and how to build a diversified portfolio with minimal effort.</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pick Individual Stocks</h3>
            <p className="text-gray-600">Understand fundamental analysis, company research, and how to identify promising stocks in the Indian market.</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Master Macroeconomics</h3>
            <p className="text-gray-600">Understand market cycles, economic indicators, and how global events impact Indian markets.</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="content" className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Educational Content</h2>
          <p className="text-lg text-gray-600">Learn from our articles, videos, and market insights</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">YouTube Videos</h3>
            <p className="text-gray-600 mb-4">Visual learning with detailed explanations, market analysis, and investment strategies.</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Watch Now →</a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Medium Articles</h3>
            <p className="text-gray-600 mb-4">In-depth analysis, investment guides, and market insights written for clarity.</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Read More →</a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Seeking Alpha</h3>
            <p className="text-gray-600 mb-4">Professional-grade analysis and stock recommendations for serious investors.</p>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Explore →</a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className="container mx-auto px-6 py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Market Insights</h2>
          <p className="text-xl text-indigo-100 mb-8">Get our latest investment guides, market analysis, and stock picks delivered to your inbox</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:outline-none focus:border-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Subscribe Free
            </button>
          </form>
          <p className="text-indigo-200 text-sm mt-4">No spam, just valuable insights. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Artha Investments. Empowering Indian investors worldwide.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-500 hover:text-indigo-600">YouTube</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">Medium</a>
            <a href="#" className="text-gray-500 hover:text-indigo-600">Seeking Alpha</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 