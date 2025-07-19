"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Zap, Mic, Calendar, Mail } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen py-24 text-center overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/5 to-primary/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gentle" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-gentle" />
      </div>

      <motion.div
        className="absolute top-20 left-10 text-primary/20 hidden lg:block"
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Mic className="h-8 w-8" />
      </motion.div>
      
      <motion.div
        className="absolute top-32 right-16 text-accent/20 hidden lg:block"
        animate={{
          y: [-8, 8, -8],
          x: [-3, 3, -3],
          rotate: [-3, 3, -3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Calendar className="h-6 w-6" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 left-20 text-primary/20 hidden lg:block"
        animate={{
          y: [-12, 12, -12],
          x: [-6, 6, -6],
          rotate: [-4, 4, -4]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <Mail className="h-10 w-10" />
      </motion.div>

      <div className="container relative z-10">
        <motion.div
          className="mx-auto max-w-5xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center glass-card rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md hover-glow"
          >
            <Sparkles className="mr-2 h-4 w-4 text-accent animate-pulse" />
            <span className="text-gradient">AI-Powered Daily Briefings</span>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
          >
            Your Personal{" "}
            <span className="relative inline-block">
                Podcast
              <motion.div
                className="absolute -inset-1 bg-gradient-primary opacity-20 blur-lg rounded-lg"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </span>{" "}
            Briefings
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-muted-foreground sm:text-2xl leading-relaxed"
          >
            Transform your emails, calendar events, and news interests into personalized daily briefings. 
            Stay informed while you commute, exercise, or relax with AI-generated conversations.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-6 sm:flex-row sm:justify-center"
          >
            <SignUpButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="group gradient-primary text-white shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 text-lg px-8 py-4">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </SignUpButton>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="group glass-card border-primary/20 hover:border-primary/40 text-lg px-8 py-4 hover-glow">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="mt-16 space-y-6"
          >
            <p className="text-sm text-muted-foreground">
              Trusted by professionals at
            </p>
            <motion.div
              className="flex items-center justify-center gap-8 md:gap-12 flex-wrap"
              variants={containerVariants}
            >
              {["Google", "Microsoft", "OpenAI", "Stripe"].map((company, index) => (
                <motion.div
                  key={company}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-lg font-semibold text-muted-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  {company}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-8 mt-12 pt-8"
          >
            {[
              { icon: Zap, label: "Instant", color: "text-accent" },
              { icon: Mic, label: "Natural", color: "text-primary" },
              { icon: Sparkles, label: "Smart", color: "text-secondary-foreground" }
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`p-3 rounded-full glass-card ${feature.color} hover-glow`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 