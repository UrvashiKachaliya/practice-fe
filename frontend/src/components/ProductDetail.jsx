import { useParams, useNavigate, useLocation } from "react-router-dom";
import { dummydata } from "../mockdata/dummydata";
import watchImage from "../assets/dummy-image.jpg";
import { useState, useEffect } from "react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const foundProduct = dummydata.find((item) => item.id === parseInt(id));
    setProduct(foundProduct);
    setIsLoading(false);
  }, [id]);

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < product?.stock) {
      setQuantity(quantity + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart:", { ...product, quantity });
    alert(`Added ${quantity} ${product?.name} to cart!`);
  };

  const handleAddToWishlist = () => {
    // Add to wishlist logic here
    // console.log("Added to wishlist:", product);
    alert(`${product?.name} added to wishlist!`);
  };

  useEffect(() => {
    console.log("Location changed:", location.pathname);
    
  },[])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Mock additional images (you can replace with actual product images)
  const productImages = [
    watchImage,
    watchImage,
    watchImage,
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        {/* <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={() => navigate("/")} className="text-gray-500 hover:text-black transition">
                Home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <button onClick={() => navigate("/products")} className="text-gray-500 hover:text-black transition">
                Products
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-semibold">{product.name}</li>
          </ol>
        </nav> */}

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Left Column - Images */}
            <div className="space-y-2">
              {/* Main Image */}
              <div className="rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-red-500">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover p-[0px] "
                />
              </div>
              
              {/* Thumbnail Images */}
              {/* {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index
                          ? "border-black ring-2 ring-offset-2 ring-black"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )} */}
            </div>

            {/* Right Column - Product Info */}
            <div className="flex flex-col space-y-6">
              {/* Product Title & Meta */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        {product.category}
                      </span>
                      {/* {product.stock > 0 ? (
                        <span className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                          In Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )} */}
                    </div>
                  </div>
                  {/* Share Button */}
                  {/* <button className="text-gray-400 hover:text-black transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button> */}
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  {/* <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div> */}
                  <span className="text-gray-500 text-sm">(128 reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                  {product.oldPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through ml-2">${product.oldPrice}</span>
                      <span className="text-green-600 text-sm ml-2">
                        Save ${(product.oldPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-b border-gray-100 py-4 my-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  <p className="text-danger-">  </p>
                </div>

                {/* Key Features/Specs */}
                {product.specifications && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Specifications</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {product.specifications.map((spec, idx) => (
                        <li key={idx} className="flex">
                          <span className="font-medium w-32">{spec.label}:</span>
                          <span>{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selector */}
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.stock} items available
                    </span>
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={handleAddToWishlist}
                    className="flex-1 bg-white border-2 border-black text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ADD TO WISHLIST
                  </button>
                </div>

                {/* Additional Info */}
                {/* <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>2 Year Warranty</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section (Optional) */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default ProductDetail;