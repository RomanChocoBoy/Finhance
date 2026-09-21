'use client';

import { useEffect, useRef } from 'react';
import { animate } from 'animejs';

export const useAnime = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);

  const fadeInUp = (delay = 0, duration = 600) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const fadeInLeft = (delay = 0, duration = 600) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      translateX: [-30, 0],
      duration,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const fadeInRight = (delay = 0, duration = 600) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      translateX: [30, 0],
      duration,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const scaleIn = (delay = 0, duration = 500) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      scale: [0.8, 1],
      duration,
      delay,
      easing: 'easeOutBack'
    });
  };

  const slideInFromBottom = (delay = 0, duration = 600) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      translateY: [50, 0],
      duration,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const staggerChildren = (selector: string, delay = 0, stagger = 100) => {
    if (!ref.current) return;
    
    animate(selector, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 500,
      delay: stagger,
      easing: 'easeOutExpo'
    });
  };

  const pulse = (delay = 0) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      scale: [1, 1.05, 1],
      duration: 200,
      delay,
      easing: 'easeInOutQuad'
    });
  };

  const shake = (delay = 0) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      translateX: [0, -10, 10, -10, 10, 0],
      duration: 400,
      delay,
      easing: 'easeInOutQuad'
    });
  };

  const modalIn = (delay = 0) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      scale: [0.9, 1],
      translateY: [20, 0],
      duration: 400,
      delay,
      easing: 'easeOutBack'
    });
  };

  const modalOut = (callback?: () => void) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [1, 0],
      scale: [1, 0.9],
      translateY: [0, 20],
      duration: 300,
      easing: 'easeInBack',
      complete: callback
    });
  };

  const tabTransition = (direction: 'left' | 'right' = 'right', delay = 0) => {
    if (!ref.current) return;
    
    const translateX = direction === 'right' ? [50, 0] : [-50, 0];
    
    animate(ref.current, {
      opacity: [0, 1],
      translateX,
      duration: 400,
      delay,
      easing: 'easeOutExpo'
    });
  };

  const chartAnimation = (delay = 0) => {
    if (!ref.current) return;
    
    animate(ref.current, {
      opacity: [0, 1],
      scale: [0.95, 1],
      duration: 800,
      delay,
      easing: 'easeOutExpo'
    });
  };

  return {
    ref,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    slideInFromBottom,
    staggerChildren,
    pulse,
    shake,
    modalIn,
    modalOut,
    tabTransition,
    chartAnimation
  };
};
