'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, 
  Lock as LockIcon, 
  BarChart2, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { Button }  from '@/components/ui/button';

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);

  // Simple animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-light to-white"
      >
        <div className="container mx-auto text-center max-w-4xl animate-on-scroll">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-merriweather text-navy leading-tight">
            Streamline Your Legal Practice with Precision
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            LegalBridge helps law firms manage cases effortlessly while providing
            transparent case tracking for clients - all in one intuitive platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="default"
              className="bg-navy hover:bg-navy/90 text-white"
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              className="border border-navy text-navy hover:bg-navy/5"
            >
              See How It Works
            </Button>
          </div>
          
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent h-20 -bottom-1"></div>
            <Image 
              src="https://images.unsplash.com/photo-1582281298055-e25b8a4dc084?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="LegalBridge Dashboard Preview" 
              width={1200}
              height={675}
              className="rounded-xl shadow-elegant max-w-full mx-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 px-6 bg-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold font-merriweather text-navy">
              Built for Legal Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines elegant design with powerful features tailored 
              specifically for law firms and their clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <FileText className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Comprehensive Case Management
              </h3>
              <p className="text-gray-600">
                Create, update and organize all your cases in one place. Track status, 
                important dates, and maintain all case documents securely.
              </p>
            </div>
            
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <LockIcon className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Client Access Portal
              </h3>
              <p className="text-gray-600">
                Share case status with clients through secure access links. No login required
                for clients - just a simple access key to view their case status.
              </p>
            </div>
            
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <BarChart2 className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Insightful Dashboards
              </h3>
              <p className="text-gray-600">
                Get an overview of your entire practice with visual dashboards. Monitor case
                progress and track key performance metrics at a glance.
              </p>
            </div>
            
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <Users className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Collaborative Workspace
              </h3>
              <p className="text-gray-600">
                Work alongside other attorneys with shared case access. Assign cases to team
                members and track contributions across your firm.
              </p>
            </div>
            
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <CheckCircle className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Status Tracking
              </h3>
              <p className="text-gray-600">
                Track cases through every stage of the legal process, from draft to completion.
                Organized workflows help maintain progress visibility.
              </p>
            </div>
            
            <div className="rounded-lg p-6 shadow-soft border border-gray-100 animate-on-scroll">
              <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center mb-4">
                <Clock className="text-navy" size={24} />
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Pre-Filing Management
              </h3>
              <p className="text-gray-600">
                Manage cases before they're officially filed. Store client information, 
                documents, and case details during preparation stages.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center animate-on-scroll">
            <Link href="/dashboard">
              <Button 
                variant="default"
                className="bg-navy hover:bg-navy/90 text-white"
              >
                Explore All Features <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-light">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold font-merriweather text-navy">
              How LegalBridge Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, intuitive workflow designed around how law firms actually operate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Create & Manage Cases
              </h3>
              <p className="text-gray-600">
                Add case details, upload documents, and assign team members to each legal matter.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Track Progress
              </h3>
              <p className="text-gray-600">
                Update case status and see them move through your workflow pipeline automatically.
              </p>
            </div>
            
            <div className="text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold font-merriweather text-navy mb-3">
                Share With Clients
              </h3>
              <p className="text-gray-600">
                Generate access links for clients to check their case status without needing logins.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section 
        ref={pricingRef}
        className="py-20 px-6 bg-white"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold font-merriweather text-navy">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your practice size and needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-lg p-6 border border-gray-200 shadow-soft animate-on-scroll">
              <div className="text-center pb-6">
                <h3 className="text-xl font-bold font-merriweather text-navy">Solo Practice</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-navy">$29</span>
                  <span className="ml-1 text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Billed annually ($348)</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Up to 50 active cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited client access links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">5GB document storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              
              <Button 
                variant="default"
                className="w-full bg-navy hover:bg-navy/90 text-white"
              >
                Start Free Trial
              </Button>
            </div>
            
            <div className="rounded-lg p-6 border-2 border-navy shadow-elegant relative animate-on-scroll">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                Most Popular
              </div>
              
              <div className="text-center pb-6">
                <h3 className="text-xl font-bold font-merriweather text-navy">Small Firm</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-navy">$79</span>
                  <span className="ml-1 text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Billed annually ($948)</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Up to 200 active cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited client access links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">20GB document storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Priority email & chat support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Team collaboration features</span>
                </li>
              </ul>
              
              <Button 
                variant="default"
                className="w-full bg-navy hover:bg-navy/90 text-white"
              >
                Start Free Trial
              </Button>
            </div>
            
            <div className="rounded-lg p-6 border border-gray-200 shadow-soft animate-on-scroll">
              <div className="text-center pb-6">
                <h3 className="text-xl font-bold font-merriweather text-navy">Law Firm</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-navy">$199</span>
                  <span className="ml-1 text-gray-500">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Billed annually ($2,388)</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited client access links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">100GB document storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">24/7 priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Advanced reporting & analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-600">Custom branding options</span>
                </li>
              </ul>
              
              <Button 
                variant="default"
                className="w-full bg-navy hover:bg-navy/90 text-white"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-navy text-white">
        <div className="container mx-auto text-center max-w-3xl animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold font-merriweather mb-6">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-lg text-gray-200 mb-10">
            Join hundreds of law firms already using LegalBridge to streamline their case management
            and improve client satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="default"
              className="bg-white text-navy hover:bg-gray-100"
            >
              Start Free 14-Day Trial
            </Button>
            <Button
              variant="outline"
              className="border border-white text-white hover:bg-white/10"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
} 