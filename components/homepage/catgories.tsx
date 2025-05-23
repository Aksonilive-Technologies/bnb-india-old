interface Category {
  name: string;
  icon: string;
}

const categories: Category[] = [
  {
    name: 'Kid-Friendly Villas',
    icon: "👶"
  },
  {
    name: 'Close to Nature',
    icon: "🍃"
  },
  {
    name: 'Pet-Friendly Escapes',
    icon: "🐶"
  },
  {
    name: 'Luxury Retreats',
    icon: "💎"
  },
  {
    name: 'Wellness Retreats',
    icon: "😇"
  },
  {
    name: 'Beachside Villas',
    icon: "🏖️"
  },
  {
    name: 'Mountain Escapes',
    icon: "⛰️"
  },
  {
    name: 'Exclusive Private Villas',
    icon: "🏡"
  },
  {
    name: 'Eco-Friendly Stays',
    icon: "🌱",
  },
  {
    name: 'Family Gatherings',
    icon: "👨‍👩‍👦"
  },
  {
    name: 'Adventure Stays',
    icon: "🏕️"
  },
  {
    name: 'Budget-Friendly Luxury',
    icon: "🪙"
  }
  
];

// Define an array of random colors
const colors = [
    'bg-red-100',
    'bg-green-100',
    'bg-blue-100',
    'bg-yellow-100',
    'bg-pink-100',
    'bg-purple-100',
    'bg-indigo-100',
    'bg-teal-100',
  ];
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

const Categories = () => {
  return (
    <div className="p-2 py-10 md:p-10 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2  md:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-wrap justify-center sm:justify-start items-center p-4 bg-white shadow rounded-lg hover:bg-gray-50"
          >
            <div className={`${getRandomColor()} p-1 rounded-full text-3xl`}>{category.icon}</div>          
            <div className="ml-4">
              <h3 className="font-bold text-lg text-center sm:text-start">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
