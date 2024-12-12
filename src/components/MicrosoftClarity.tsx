'use client';

import Script from 'next/script';

export default function MicrosoftClarity() {
  return (
    <>
      <Script
        id="microsoft-clarity-script"
        strategy="afterInteractive"
        src={`https://www.clarity.ms/tag/pclebv1xx3`}
      />
      <Script
        id="microsoft-clarity-init"
        strategy="afterInteractive"
      >
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          })(window, document, "clarity", "script", "pclebv1xx3");
        `}
      </Script>
    </>
  );
} 