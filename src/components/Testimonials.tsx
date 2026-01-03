import { motion } from "framer-motion";
import { Quote, Star, TrendingUp, Flame } from "lucide-react";

const testimonials = [
  {
    text: "Bro this AI violated me 💀",
    author: "@vibecheck_raj",
    avatar: "VR",
    color: "from-purple-500 to-pink-500",
    rating: 5,
  },
  {
    text: "Didn't expect it to be this accurate. Called me out fr fr.",
    author: "@anxious_priya",
    avatar: "AP",
    color: "from-blue-500 to-cyan-500",
    rating: 5,
  },
  {
    text: "Shared my result on Instagram, friends went crazy 😭",
    author: "@maincharacter_arjun",
    avatar: "MA",
    color: "from-pink-500 to-rose-500",
    rating: 5,
  },
  {
    text: "The roast was so brutal I had to take a break from my phone",
    author: "@overthinking_shreya",
    avatar: "OS",
    color: "from-orange-500 to-red-500",
    rating: 5,
  },
  {
    text: "Better than any personality test I've ever taken ngl",
    author: "@cryptobro_amit",
    avatar: "CA",
    color: "from-cyan-500 to-blue-500",
    rating: 5,
  },
  {
    text: "My aura score went from 34 to 67 in 2 months. Self improvement arc fr",
    author: "@grindset_nikhil",
    avatar: "GN",
    color: "from-green-500 to-emerald-500",
    rating: 5,
    featured: true,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="orb orb-purple w-[500px] h-[500px] top-0 -left-48 opacity-20" />
      <div className="orb orb-pink w-[400px] h-[400px] bottom-0 -right-48 opacity-20" style={{ animationDelay: '-5s' }} />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 mb-6"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-orange-400">Real Reactions</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </motion.div>
          
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            The <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">victims</span> speak
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real reactions from real people who got their aura checked. No cap, these are actual responses.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative group ${testimonial.featured ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Card */}
              <div className="glass-card p-6 h-full relative overflow-hidden border-2 border-white/10 hover:border-primary/30 transition-all duration-300">
                {/* Gradient glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                
                {/* Featured badge */}
                {testimonial.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                    <TrendingUp className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">Glow Up</span>
                  </div>
                )}
                
                {/* Quote icon */}
                <div className="relative z-10">
                  <Quote className="w-8 h-8 text-primary/40 mb-4" />
                  
                  {/* Testimonial text */}
                  <p className="text-foreground mb-4 text-base leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-sm font-bold text-white shadow-lg`}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <span className="text-muted-foreground text-sm font-medium">
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: "Users Roasted", value: "50K+", icon: Flame },
            { label: "Avg Rating", value: "4.9/5", icon: Star },
            { label: "Viral Shares", value: "25K+", icon: TrendingUp },
            { label: "Accuracy", value: "87%", icon: Quote },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              className="glass-card p-6 text-center border border-white/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
