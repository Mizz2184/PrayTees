
import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight">
          Stay Connected
        </h2>
        
        <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Join our community of believers and be the first to know about new designs, 
          exclusive offers, and inspiring content.
        </p>

        {isSubscribed ? (
          <div className="bg-green-600 text-white p-4 rounded mb-8 max-w-md mx-auto">
            <p className="font-bold">Thank you for subscribing!</p>
            <p className="text-sm">Check your email for confirmation.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
          <p>✓ Exclusive offers & early access</p>
          <p>✓ Weekly inspiration & scripture</p>
          <p>✓ Unsubscribe anytime</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
