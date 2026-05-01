import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import backgroundImage from '../assets/background.png';
import adminImage from '../assets/admin.png';
import farmerImage from '../assets/farmer.png';
import Header from '../Components/Header';
import FarmerSignupSection from '../Components/FarmerSignupSection';
import FarmerLoginSection from '../Components/FarmerLoginSection';
import AdminLoginSection from '../Components/AdminLoginSection';
import FarmerDashboardSection from '../Components/FarmerDashboardSection';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const [activePanel, setActivePanel] = useState("info");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef();
  const cardsContainerRef = useRef();
  const cardRefs = useRef([]);
  const aboutSectionRef = useRef();
  const howItWorksRef = useRef();
  const stepRefs = useRef([]);
  const statRefs = useRef([]);
  const infoPanelContainerRef = useRef();
  const signupSectionRef = useRef();

  // Add cards to refs array
  const addToCardRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  // Add steps to refs array
  const addToStepRefs = (el) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  // Add stats to refs array
  const addToStatRefs = (el) => {
    if (el && !statRefs.current.includes(el)) {
      statRefs.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation for the main cards container (blur background)
      gsap.from(cardsContainerRef.current, {
        x: -100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3
      });

      // Sequential animation for each card
      cardRefs.current.forEach((card, index) => {
        gsap.from(card, {
          x: -150,
          opacity: 0,
          rotationY: -30,
          duration: 2,
          ease: "back.out(1.7)",
          delay: 0.8 + (index * 0.6),
          clearProps: "all"
        });

        // Enhanced hover animations
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            rotationY: 5,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            rotationY: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // Calculate timing: Last card finishes at 0.8 + (2 * 0.6) + 2 = 4.0 seconds
      // About section starts after cards finish = 4.0 + 0.5 = 4.5 seconds
      // How It Works starts after About section = 4.5 + 1 = 5.5 seconds

      // Set initial state: About section off-screen to the right (hidden)
      // Using a large value to ensure it's completely off-screen
      if (aboutSectionRef.current) {
        gsap.set(aboutSectionRef.current, {
          x: 1500,
          opacity: 0,
          visibility: 'hidden'
        });
      }

      // About section animation (after cards finish) - slides in from right
      gsap.to(aboutSectionRef.current, {
        x: 0,
        opacity: 1,
        visibility: 'visible',
        duration: 1.5,
        ease: "power3.out",
        delay: 4.5
      });

      // About title animation
      gsap.from('.about-title', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 4.7
      });

      // About paragraphs animation
      gsap.from('.about-paragraph', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.3,
        delay: 4.8
      });

      // Stats counter animation
      statRefs.current.forEach((stat, index) => {
        const number = stat.querySelector('.stat-number');
        const text = stat.querySelector('.stat-text');
        
        // Number counting animation
        gsap.from(number, {
          textContent: 0,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          delay: 5.0 + (index * 0.2)
        });

        // Stat container animation
        gsap.from(stat, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 5.0 + (index * 0.1)
        });

        // Text animation
        gsap.from(text, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          delay: 5.0 + (index * 0.3)
        });

        // Hover effect for stats
        stat.addEventListener('mouseenter', () => {
          gsap.to(stat, {
            y: -5,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        stat.addEventListener('mouseleave', () => {
          gsap.to(stat, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // How It Works section animation (after About section)
      gsap.from(howItWorksRef.current, {
        x: 500,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        delay: 5.5
      });

      // How It Works title animation
      gsap.from('.how-it-works-title', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 5.7
      });

      // Individual step animations (keep same animations, no ScrollTrigger)
      stepRefs.current.forEach((step, index) => {
        // Number circle animation
        const numberCircle = step.querySelector('.number-circle');
        if (numberCircle) {
          gsap.from(numberCircle, {
            scale: 0,
            rotation: -180,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 5.8 + (index * 0.2)
          });
        }

        // Step content animation
        const stepContent = step.querySelector('.step-content');
        if (stepContent) {
          gsap.from(stepContent, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 5.9 + (index * 0.2)
          });
        }

        // Hover animation for steps
        step.addEventListener('mouseenter', () => {
          gsap.to(step, {
            y: -5,
            backgroundColor: 'rgba(249, 250, 251, 0.8)',
            duration: 0.3,
            ease: "power2.out"
          });
          if (numberCircle) {
            gsap.to(numberCircle, {
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        step.addEventListener('mouseleave', () => {
          gsap.to(step, {
            y: 0,
            backgroundColor: 'transparent',
            duration: 0.3,
            ease: "power2.out"
          });
          if (numberCircle) {
            gsap.to(numberCircle, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      });

    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  // Animation for panel transitions
  useEffect(() => {
    if (activePanel === "signup") {
      // Wait for React to render the signup section
      setTimeout(() => {
        const aboutSection = aboutSectionRef.current;
        const signupSection = signupSectionRef.current;

        if (signupSection) {
          // Set initial state for signup section (off-screen to the right)
          gsap.set(signupSection, { x: 500, opacity: 0 });

          if (aboutSection) {
            // Fade out "About the Platform" section
            gsap.to(aboutSection, {
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                setIsTransitioning(false);
                // After fade out, animate signup section from right to left
                gsap.to(signupSection, {
                  x: 0,
                  opacity: 1,
                  duration: 0.8,
                  ease: "power3.out"
                });
              }
            });
          } else {
            // If about section is already unmounted, just animate signup section
            setIsTransitioning(false);
            gsap.to(signupSection, {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out"
            });
          }
        }
      }, 10);
    } else if (activePanel === "info") {
      const aboutSection = aboutSectionRef.current;
      const signupSection = signupSectionRef.current;

      if (signupSection) {
        // Fade out signup section and move it to the right
        gsap.to(signupSection, {
          x: 500,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            setIsTransitioning(false);
            // Fade in "About the Platform" section
            if (aboutSection) {
              gsap.to(aboutSection, {
                opacity: 1,
                duration: 0.8,
                ease: "power3.out"
              });
            }
          }
        });
      } else if (aboutSection) {
        // If signup section doesn't exist, just fade in about section
        setIsTransitioning(false);
        gsap.to(aboutSection, {
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        });
      }
    }
  }, [activePanel]);

  const renderInfoPanel = () => (
    <div ref={infoPanelContainerRef}>
      {/* About Section */}
      <div 
        ref={aboutSectionRef}
        className="about-section  bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 max-w-2xl w-full"
      >
        <h3 className="about-title text-3xl lg:text-4xl font-bold mb-6 text-gray-800 text-center">About the Platform</h3>
        <p className="about-paragraph text-lg lg:text-xl leading-relaxed text-gray-700 text-justify">
          This platform helps peri urban farmers and forms a bridge between rural administration and urban authority so that people doing farming in urban and rural regions can apply for government compensation after crop damage by uploading photos or videos of damaged fields along with relevant land and personal details.
        </p>
        <p className="about-paragraph text-lg lg:text-xl leading-relaxed text-gray-700 text-justify mt-4">
          Our mission is to create a transparent and efficient process where farmers can easily report crop damage and administrators can quickly verify submissions, ensuring timely assistance and compensation for those who need it most.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div 
            ref={addToStatRefs}
            className="bg-green-50 rounded-xl p-4 transition-all duration-300 cursor-pointer"
          >
            <div className="stat-number text-2xl font-bold text-green-700">500+</div>
            <div className="stat-text text-sm text-green-600 mt-2">Farmers Helped</div>
          </div>
          <div 
            ref={addToStatRefs}
            className="bg-blue-50 rounded-xl p-4 transition-all duration-300 cursor-pointer"
          >
            <div className="stat-number text-2xl font-bold text-blue-700">95%</div>
            <div className="stat-text text-sm text-blue-600 mt-2">Success Rate</div>
          </div>
          <div 
            ref={addToStatRefs}
            className="bg-yellow-50 rounded-xl p-4 transition-all duration-300 cursor-pointer"
          >
            <div className="stat-number text-2xl font-bold text-yellow-700">24/7</div>
            <div className="stat-text text-sm text-yellow-600 mt-2">Support Available</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div 
        ref={howItWorksRef}
        className="how-it-works-section bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:p-8 max-w-2xl w-full mt-8"
      >
        <h3 className="how-it-works-title text-2xl lg:text-3xl font-bold mb-6 text-gray-800 text-center">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            ref={addToStepRefs}
            className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 border border-gray-100 h-full"
          >
            <div className="flex-shrink-0 mb-4">
              <div className="number-circle w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">1</span>
              </div>
            </div>
            <div className="step-content flex-1 flex flex-col">
              <h4 className="text-lg font-semibold mb-2 text-green-700">Register & Report</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sign up and upload photos/videos of crop damage with necessary documents.
              </p>
            </div>
          </div>
          <div 
            ref={addToStepRefs}
            className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 border border-gray-100 h-full"
          >
            <div className="flex-shrink-0 mb-4">
              <div className="number-circle w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">2</span>
              </div>
            </div>
            <div className="step-content flex-1 flex flex-col">
              <h4 className="text-lg font-semibold mb-2 text-blue-700">Verification</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Administrators review and verify claims, validate documents, and assess damage.
              </p>
            </div>
          </div>
          <div 
            ref={addToStepRefs}
            className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 border border-gray-100 h-full"
          >
            <div className="flex-shrink-0 mb-4">
              <div className="number-circle w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">3</span>
              </div>
            </div>
            <div className="step-content flex-1 flex flex-col">
              <h4 className="text-lg font-semibold mb-2 text-yellow-700">Compensation</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Once verified, claim is processed and compensation is transferred directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDynamicPanel = () => {
    switch (activePanel) {
      case "signup":
        return (
          <div ref={signupSectionRef} className="w-full flex items-center justify-center">
            <FarmerSignupSection onNavigate={setActivePanel} />
          </div>
        );
      case "login":
        return (
          <div className="w-full flex items-center justify-center">
            <FarmerLoginSection onNavigate={setActivePanel} />
          </div>
        );
      case "admin":
        return (
          <div className="w-full flex items-center justify-center mt-[-157px]">
            <AdminLoginSection onNavigate={setActivePanel} />
          </div>
        );
      case "dashboard":
        return (
          <div className="w-full flex items-center justify-center">
            <FarmerDashboardSection onNavigate={setActivePanel} />
          </div>
        );
      default:
        return renderInfoPanel();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />

      {/* Main content container */}
      <div className="flex-grow flex flex-col lg:flex-row mt-12 pb-8 lg:pb-8">
        {/* Left side - Cards container with blur background */}
        <div className="w-full lg:w-2/5 flex items-start justify-center pl-6 lg:pl-16 py-8 lg:py-8">
          <div 
            ref={cardsContainerRef}
            className="backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            <div className="space-y-8">
              {/* Farmer Card */}
              <div
                ref={addToCardRefs}
                onClick={() => {
                  setIsTransitioning(true);
                  const aboutSection = aboutSectionRef.current;
                  if (aboutSection) {
                    // Fade out about section first
                    gsap.to(aboutSection, {
                      opacity: 0,
                      duration: 0.5,
                      ease: "power2.in",
                      onComplete: () => {
                        setActivePanel("signup");
                      }
                    });
                  } else {
                    setActivePanel("signup");
                  }
                }}
                className="bg-white bg-opacity-90 rounded-xl p-6 text-center shadow-md cursor-pointer transform transition duration-300 hover:shadow-2xl hover:scale-105 w-full"
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src={farmerImage}
                  alt="Farmer"
                  className="w-36 h-36 mx-auto object-contain mb-4"
                />
                <h2 className="text-2xl font-bold mb-2 text-green-800">Farmer</h2>
                <p className="text-gray-600">Signup & Upload Crop Damage</p>
              </div>

              {/* Admin Card */}
              <div
                ref={addToCardRefs}
                onClick={() => setActivePanel("admin")}
                className="bg-white bg-opacity-90 rounded-xl p-6 text-center shadow-md cursor-pointer transform transition duration-300 hover:shadow-2xl hover:scale-105 w-full"
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                <img
                  src={adminImage}
                  alt="Admin"
                  className="w-36 h-36 mx-auto object-contain mb-4"
                />
                <h2 className="text-2xl font-bold mb-2 text-blue-800">Admin</h2>
                <p className="text-gray-600">Login to Verify Submissions</p>
              </div>

              {/* WhatsApp Bot Card */}
              <div
                ref={addToCardRefs}
                className="bg-white bg-opacity-90 rounded-xl p-6 text-center shadow-md cursor-pointer transform transition duration-300 hover:shadow-2xl hover:scale-105 w-full"
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="flex flex-col items-center">
                  {/* WhatsApp Icon */}
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg 
                      className="w-12 h-12 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2 text-green-700">WhatsApp Bot</h2>
                  <p className="text-gray-600 mb-4">Register via WhatsApp</p>
                  
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4 w-full text-left">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div className="ml-2 flex-1">
                        <h3 className="text-sm font-semibold text-green-800 mb-1">
                          📱 Easy WhatsApp Registration
                        </h3>
                        <p className="text-sm text-green-700 mb-2">
                          Send <strong>"hi"</strong> to <strong>+1 (415) 523-8886</strong> on WhatsApp for quick registration!
                        </p>
                        <a 
                          href="https://wa.me/14155238886?text=hi" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Start WhatsApp Chat
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - About and How It Works sections */}
        <div className="w-full lg:w-3/5 flex flex-col items-start px-6 lg:px-50 pt-8 lg:pt-8 pb-8 lg:pb-8 space-y-8 min-h-[800px] overflow-hidden">
          {renderDynamicPanel()}
        </div>
      </div>
    </div>
  );
};

export default Homepage;