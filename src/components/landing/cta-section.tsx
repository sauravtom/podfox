"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function CTASection() {
  const features = [
    { icon: <Zap className="h-4 w-4" />, text: "7-day free trial" },
    { icon: <Shield className="h-4 w-4" />, text: "No credit card required" },
    { icon: <Sparkles className="h-4 w-4" />, text: "Cancel anytime" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const floatingIconVariants = {
    animate: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      rotate: [-10, 10, -10],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10" />
      <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse-gentle" />
      <div className="absolute bottom-1/3 right-1/5 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse-gentle" />
      
      <motion.div
        className="absolute top-20 left-10 text-primary/20 hidden lg:block"
        animate={{
          y: [-15, 15, -15],
          x: [-8, 8, -8],
          rotate: [-10, 10, -10],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-20 right-16 text-accent/20 hidden lg:block"
        animate={{
          y: [-12, 12, -12],
          x: [-6, 6, -6],
          rotate: [5, -5, 5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Zap className="h-8 w-8" />
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-5xl"
        >
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl glass-card border-0 p-8 md:p-16 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
            
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            <div className="relative z-10 space-y-8">
              <motion.div variants={itemVariants}>
                <motion.div
                  className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium mb-6"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>Join 10,000+ satisfied users</span>
                </motion.div>
                
                <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
                  Ready to Transform Your{" "}
                  <motion.span
                    className="relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    Daily Briefings?
                    <motion.div
                      className="absolute inset-0 bg-white/20 blur-lg rounded-lg"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.span>
                </h2>
              </motion.div>
              
              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-3xl text-xl text-white/90 leading-relaxed"
              >
                Join thousands of professionals who stay informed with AI-powered podcast briefings. 
                Start your free trial today and experience the future of personalized content.
              </motion.p>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-6 sm:flex-row sm:justify-center"
              >
                <SignUpButton>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="group bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-white/25 transition-all duration-300 text-lg px-10 py-4 font-semibold"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </SignUpButton>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="glass-card border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-10 py-4"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-6 pt-6"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                                         transition={{ 
                       delay: 0.8 + index * 0.1,
                       duration: 0.4
                     }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors cursor-pointer group"
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-2 pt-4"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                                         transition={{ 
                       delay: 1.2 + i * 0.1,
                       duration: 0.4
                     }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-yellow-900 text-xs font-bold">★</span>
                  </motion.div>
                ))}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  className="ml-3 text-sm font-medium text-white/70"
                >
                  4.9/5 from 10,000+ users
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 