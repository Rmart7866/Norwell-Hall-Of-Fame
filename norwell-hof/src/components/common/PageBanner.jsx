// src/components/common/PageBanner.jsx
const PageBanner = ({ title, subtitle, backgroundImage }) => {
    return (
      <div 
        className="relative h-96 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-norwell-blue/80 via-norwell-blue/70 to-norwell-blue/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-norwell-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-norwell-gold rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-norwell-gold font-bold drop-shadow-lg">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-norwell-blue via-norwell-gold to-norwell-blue"></div>
      </div>
    );
  };
  
  export default PageBanner;