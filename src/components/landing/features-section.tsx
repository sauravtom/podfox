"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, Mail, Mic, Podcast, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Intelligence",
      description: "Automatically extract key insights from your important emails and newsletters.",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Calendar Integration",
      description: "Stay ahead with briefings on upcoming meetings and events.",
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Research Agent",
      description: "Smart AI that researches your interests and delivers personalized news.",
      gradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/10",
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Natural Conversations",
      description: "AI-generated podcast conversations that feel natural and engaging.",
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
    },
    {
      icon: <Podcast className="h-8 w-8" />,
      title: "Professional Quality",
      description: "High-quality audio output ready for your daily commute or workout.",
      gradient: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-500/10",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Generate your personalized briefing in minutes, not hours.",
      gradient: "from-yellow-500 to-orange-500",
      iconBg: "bg-yellow-500/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-gentle" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse-gentle" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Everything You Need for{" "}
            <span className="text-gradient">Daily Briefings</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powered by cutting-edge AI to transform your information into engaging audio content.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              <Card className="glass-card border-0 h-full hover-lift overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="space-y-4">
                  <motion.div
                    variants={iconVariants}
                    className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}
                  >
                    <div className={`text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text`}>
                      {feature.icon}
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who trust our AI-powered platform
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                                 transition={{ 
                   delay: 0.6 + i * 0.1,
                   duration: 0.4
                 }}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
              >
                <span className="text-white text-sm">★</span>
              </motion.div>
            ))}
            <span className="ml-3 text-sm font-medium text-muted-foreground">
              4.9/5 from 2,000+ users
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 