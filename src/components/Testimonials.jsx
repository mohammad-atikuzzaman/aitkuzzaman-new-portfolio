import React from 'react';

export default function Testimonials() {
  const defaultTestimonials = [
    {
      quote: "Templyo completely changed how I approach building sites in Framer. The templates are not just beautiful, they’re actually structured in a way that makes scaling so much easier.",
      name: "Yakoub Kashmiri",
      role: "Marketing Director",
      avatar: "https://framerusercontent.com/images/WsYTUG4cqmLIU4lwbMUQX7FdOY.png?width=160&height=160",
    },
    {
      quote: "I’ve tried dozens of Framer templates, but Templyo stands out. Everything feels intentional, from the layout to the smallest interactions.",
      name: "Daniel K.",
      role: "Indie Maker",
      avatar: "https://framerusercontent.com/images/HqoHkPp6dpJFdgMqUKIaAXmy7o.jpg?scale-down-to=512&width=3220&height=3220",
    },
    {
      quote: "Templyo saved me weeks of work. I was able to launch my landing page in a day, and it still looks fully custom.",
      name: "Mark M.",
      role: "Startup Founder",
      avatar: "https://framerusercontent.com/images/HH8KrojyxZx6X20z1r13CSwiiWE.jpg?scale-down-to=512&width=3648&height=3648",
    },
    {
      quote: "The quality is insane. Clean structure, smooth animations, and super easy to customize. It feels like a premium product from start to finish.",
      name: "Omar H.",
      role: "Frontend Developer",
      avatar: "https://framerusercontent.com/images/MG7SSqT3AUbDDMeyGynYFWvAWI.png?width=160&height=160",
    },
  ];

  const [testimonials, setTestimonials] = React.useState(defaultTestimonials);

  React.useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data?.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback testimonials:', err.message);
      });
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-14">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] font-heading">
          Testimonials
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-[#141414] text-white rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-xl border border-white/5 hover:border-white/20 transition-all duration-300 group"
          >
            <p className="text-lg sm:text-xl font-normal leading-relaxed text-neutral-200 mb-8">
              "{item.quote}"
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover border border-white/20 grayscale group-hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
              <div>
                <h4 className="font-semibold text-base text-white tracking-tight">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {item.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
