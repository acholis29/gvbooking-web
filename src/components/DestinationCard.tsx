// components/DestinationCard.tsx
import React from "react";

type DestinationCardProps = {
  image: string;
  title: string;
  activities: number;
  link?: string; // optional
};

const DestinationCard: React.FC<DestinationCardProps> = ({
  image,
  title,
  activities,
  link = "#",
}) => {
  return (
    <a href={link} className="block group">
      <div className="relative shrink-0 md:shrink h-48 w-72 md:w-full rounded-xl overflow-hidden shadow-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-4">
          <h3 className="text-white text-lg font-bold uppercase">{title}</h3>
          <p className="text-white text-sm font-bold">
            {activities} Activities
          </p>
        </div>
      </div>
    </a>
  );
};

export default DestinationCard;
