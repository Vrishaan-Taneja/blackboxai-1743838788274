import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} QuestForge. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/terms" className="hover:text-blue-300">Terms</a>
          <a href="/privacy" className="hover:text-blue-300">Privacy</a>
          <a href="/contact" className="hover:text-blue-300">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;