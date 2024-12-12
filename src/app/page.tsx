'use client';

import { useState } from 'react';
import TaxCalculator from '../components/TaxCalculator';
import Image from 'next/image';

export default function Home() {
  const [entityType, setEntityType] = useState<'none' | 'person' | 'company'>('none');

  return (
    <main className="min-h-screen h-[100dvh] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden flex flex-col">
      {/* Animated logo background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="animate-spin-slow">
          <Image
            src="/Lockup - Blue.png"
            alt="Background Logo"
            width={1000}
            height={250}
            className="object-contain opacity-50"
          />
        </div>
      </div>

      {/* Logo in corner */}
      <div className="absolute top-6 right-6 sm:right-8">
        <Image
          src="/Logomark - Blue.png"
          alt="Company Logomark"
          width={50}
          height={50}
          className="object-contain"
        />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-4 mt-20">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight px-4">
              How much do you make from your rental property?
            </h1>
          </div>

          <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
            {entityType === 'none' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
                  What are you renting as?
                </h2>
                <div className="space-y-6">
                  <button
                    onClick={() => setEntityType('person')}
                    className="w-full py-8 px-6 bg-blue-600 text-white rounded-2xl font-bold text-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
                  >
                    Person
                  </button>
                  <button
                    onClick={() => setEntityType('company')}
                    className="w-full py-8 px-6 bg-blue-600 text-white rounded-2xl font-bold text-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95"
                  >
                    Company
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <button
                  onClick={() => setEntityType('none')}
                  className="mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl font-bold text-blue-600 hover:bg-white/90 transition-all shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
                <TaxCalculator entityType={entityType} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}