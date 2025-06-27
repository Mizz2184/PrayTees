
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Austin, TX",
      text: "PrayTees has become my go-to for faith-based apparel. The quality is amazing and the designs help me share my faith boldly.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      location: "Phoenix, AZ", 
      text: "I love how comfortable these shirts are and the messages are so inspiring. I get compliments everywhere I go!",
      rating: 5
    },
    {
      id: 3,
      name: "Jessica Chen",
      location: "Seattle, WA",
      text: "The scripture tees collection is my favorite. It's a beautiful way to carry God's word with me throughout the day.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
            What People Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from our community of believers who are wearing their faith boldly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div>
                <p className="font-bold text-black uppercase tracking-wide text-sm">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {testimonial.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
