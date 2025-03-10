
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="font-sans text-xl font-bold">Legal<span className="text-gold">Bridge</span></span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Streamline your legal practice with our intuitive case management system.
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-sans text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard" className="text-sm text-gray-300 hover:text-white smooth-transition">Dashboard</Link></li>
              <li><Link href="/cases" className="text-sm text-gray-300 hover:text-white smooth-transition">Cases</Link></li>
              <li><Link href="/" className="text-sm text-gray-300 hover:text-white smooth-transition">Features</Link></li>
              <li><Link href="/" className="text-sm text-gray-300 hover:text-white smooth-transition">Pricing</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-sans text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Help Center</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Documentation</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">API Reference</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Tutorials</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-sans text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">About</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-300 hover:text-white smooth-transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} LegalBridge. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white smooth-transition">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white smooth-transition">Terms of Service</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white smooth-transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
