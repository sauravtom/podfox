"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "glass-card border-b border-border/40 shadow-lg backdrop-blur-xl" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <motion.div variants={itemVariants}>
            <Link className="mr-8 flex items-center space-x-2 group" href="/">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Zap className="h-7 w-7 text-primary" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <span className="hidden font-bold text-xl sm:inline-block text-gradient hover:scale-105 transition-transform">
                Podgenius
              </span>
            </Link>
          </motion.div>
          
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item, index) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  className="relative text-foreground/70 hover:text-foreground transition-colors group py-2"
                  href={item.href}
                >
                  <span className="relative z-10">{item.label}</span>
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"
                    whileHover={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center rounded-xl p-2 text-foreground hover:bg-primary/10 transition-colors md:hidden"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle Menu</span>
        </motion.button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <motion.div 
            variants={itemVariants}
            className="w-full flex-1 md:w-auto md:flex-none"
          >
            <Link className="mr-6 flex items-center space-x-2 md:hidden group" href="/">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="font-bold text-gradient">Podgenius</span>
            </Link>
          </motion.div>
          
          <motion.nav 
            variants={itemVariants}
            className="flex items-center space-x-3"
          >
            <SignInButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-all duration-300">
                  Sign In
                </Button>
              </motion.div>
            </SignInButton>
            <SignInButton>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="gradient-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300">
                  Get Started
                </Button>
              </motion.div>
            </SignInButton>
          </motion.nav>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="glass-card border-t border-border/40 md:hidden overflow-hidden"
          >
            <motion.nav className="flex flex-col space-y-1 p-4">
              {navItems.map((item, index) => (
                <motion.div key={item.href} variants={mobileItemVariants}>
                  <Link
                    className="flex items-center rounded-lg px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-300 group"
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative">
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                variants={mobileItemVariants}
                className="pt-4 border-t border-border/20 mt-4"
              >
                <div className="flex flex-col space-y-2">
                  <SignInButton>
                    <Button 
                      variant="ghost" 
                      className="justify-start hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignInButton>
                    <Button 
                      className="justify-start gradient-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Button>
                  </SignInButton>
                </div>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 