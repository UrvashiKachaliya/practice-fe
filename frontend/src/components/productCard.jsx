import watchImage from "../assets/dummy-image.jpg"
export default function ProductCard({product}) {
  const {name,price,category,originalPrice}= product
  return (
    <div className="w-full max-w-[260px] mx-auto bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300">
        <img  
        src={watchImage}
        alt="watch"
        className="w-full object-cover rounded-t-xl p-[33px] md:p-0 l  lg:p-3"
      />
      <div className="p-3 text-center">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-500 text-sm">{category}</p>

        <div className="mt-2">
          <span className="font-bold text-lg">$ {price}</span>
          <span className="line-through text-gray-400 text-sm ml-2">
            ${originalPrice}
          </span>
        </div>
      </div>
    </div>
  );
}