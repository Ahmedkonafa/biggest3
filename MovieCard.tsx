
import React from 'react';
import { Link } from 'react-router-dom';
import { MediaItem } from '../types';

interface MovieCardProps {
  item: MediaItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  return (
    <Link to={`/media/${item.id}`} className="group relative block overflow-hidden rounded-3xl transition-all duration-500 hover:scale-105 shadow-2xl border border-white/5">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={item.posterUrl} 
          alt={item.title} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />
        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
           <div className="bg-blue-600 p-5 rounded-full shadow-2xl shadow-blue-600/50 transform scale-0 group-hover:scale-100 transition-transform duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
           </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-blue-600/20 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20">★ {item.rating}</span>
          <span className="text-[10px] font-black text-gray-400">{item.year}</span>
        </div>
        <h3 className="text-sm md:text-base font-black leading-tight line-clamp-1 group-hover:text-blue-500 transition-colors">{item.title}</h3>
      </div>
      
      {/* Category Badge */}
      <div className="absolute top-4 right-4">
         <span className={`backdrop-blur-md text-[9px] font-black px-2 py-1 rounded-lg border border-white/10 uppercase tracking-widest text-white ${item.category === 'رمضان 2026' ? 'bg-red-600/80' : 'bg-black/60'}`}>
            {item.category === 'رمضان 2026' ? 'RAMADAN 2026' : item.category === 'تركية' ? 'TURKISH' : 'ACTION'}
         </span>
      </div>
    </Link>
  );
};

export default MovieCard;
