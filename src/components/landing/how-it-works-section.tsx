"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Mail, Mic, Search, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      icon: <Mail className="h-8 w-8" />,
      title: "Connect Your Sources",
      description: "Link your Gmail, calendar, and add your news interests. We securely access only what you choose to share.",
      gradient: "from-blue-500 to-cyan-500",
      color: "text-blue-500",
    },
    {
      step: "02",
      icon: <Search className="h-8 w-8" />,
      title: "AI Research & Analysis",
      description: "Our AI agents research trending topics, analyze your emails, and identify key calendar events.",
      gradient: "from-purple-500 to-pink-500",
      color: "text-purple-500",
    },
    {
      step: "03",
      icon: <Mic className="h-8 w-8" />,
      title: "Generate Podcast",
      description: "Advanced AI creates a natural conversation between two hosts discussing your personalized content.",
      gradient: "from-green-500 to-emerald-500",
      color: "text-green-500",
    },
    {
      step: "04",
      icon: <Calendar className="h-8 w-8" />,
      title: "Daily Delivery",
      description: "Receive your briefing as a podcast episode, automatically uploaded to your private YouTube playlist.",
      gradient: "from-orange-500 to-red-500",
      color: "text-orange-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { 
      x: -50, 
      opacity: 0,
      scale: 0.95
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, rgba(156, 146, 172, 0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
      </div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-gentle" />
      <div className="absolute bottom-1/4 left-1/5 w-56 h-56 bg-accent/5 rounded-full blur-2xl animate-pulse-gentle" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            How <span className="text-gradient">Podfox</span> Works
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            From raw information to polished podcast in four simple steps.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 lg:space-y-16"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={stepVariants} className="relative">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {index % 2 === 0 ? (
                  <>
                    <div className="flex-1 lg:pr-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="glass-card border-0 hover-lift overflow-hidden relative group">
                          <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                          <CardContent className="p-8 lg:p-10">
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                              <div className="flex flex-col items-center lg:items-start gap-4 flex-shrink-0">
                                <Badge variant="secondary" className={`text-lg font-bold px-4 py-2 bg-gradient-to-r ${step.gradient} text-white border-0`}>
                                  {step.step}
                                </Badge>
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  className={`p-4 rounded-2xl bg-gradient-to-br ${step.gradient} bg-opacity-10 ${step.color}`}
                                >
                                  {step.icon}
                                </motion.div>
                              </div>
                              <div className="flex-1 text-center lg:text-left">
                                <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                  {step.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                    
                    <div className="flex-shrink-0 hidden lg:block">
                      <motion.div
                        className="w-24 h-24 rounded-full glass-card flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <ArrowRight className={`h-8 w-8 ${step.color}`} />
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-shrink-0 hidden lg:block">
                      <motion.div
                        className="w-24 h-24 rounded-full glass-card flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: -360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <ArrowRight className={`h-8 w-8 ${step.color} rotate-180`} />
                      </motion.div>
                    </div>
                    
                    <div className="flex-1 lg:pl-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="glass-card border-0 hover-lift overflow-hidden relative group">
                          <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                          <CardContent className="p-8 lg:p-10">
                            <div className="flex flex-col lg:flex-row-reverse items-center gap-6">
                              <div className="flex flex-col items-center lg:items-end gap-4 flex-shrink-0">
                                <Badge variant="secondary" className={`text-lg font-bold px-4 py-2 bg-gradient-to-r ${step.gradient} text-white border-0`}>
                                  {step.step}
                                </Badge>
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: -5 }}
                                  className={`p-4 rounded-2xl bg-gradient-to-br ${step.gradient} bg-opacity-10 ${step.color}`}
                                >
                                  {step.icon}
                                </motion.div>
                              </div>
                              <div className="flex-1 text-center lg:text-right">
                                <h3 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                                  {step.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-8 lg:hidden">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="w-12 h-12 rounded-full glass-card flex items-center justify-center"
                  >
                    <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">
              <span className="text-green-500">Ready in minutes</span> • 
              <span className="text-blue-500 ml-2">No technical setup</span> • 
              <span className="text-purple-500 ml-2">Always secure</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 