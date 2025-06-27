import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
              Pray<span className="text-blue-400">Tees</span>
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Wear your faith boldly with premium PRAY apparel designed 
              to inspire and encourage believers everywhere.
            </p>
            <div className="flex space-x-4">
              <Instagram className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#shop" className="hover:text-white transition-colors">Shop All</a></li>
              <li><a href="#collections" className="hover:text-white transition-colors">Collections</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-sm">
              Customer Service
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold uppercase tracking-wide mb-4 text-sm">
              Get In Touch
            </h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">praytees@gmail.com</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">1-800-PRAY-TEE</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 PrayTees. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
