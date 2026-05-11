import { dummydata } from "../mockdata/dummydata";
import { useState, useEffect } from "react";
import ProductCard from "./productCard";
import { Link } from "react-router-dom";
function ProductList() {
  const [products, setProduct] = useState([]);
  useEffect(() => {
    setProduct(dummydata);
  }, []); 
  // const [loading, setLoading] =  (true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setProduct(dummydata);
  //      //console.log("loading done");
  //     setLoading(false);
  //   }, 5000); //5 sec delay
  // }, []);
  // if (loading) {
  //   return <h2 className="text-muted text-center">Loading...</h2>;
  // }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((item) => (
        <Link to={`/product/${item.id}`} key={item.id}>
          <ProductCard {...item} product={item}/>
        </Link>
      ))}
    </div>
  );
}

export default ProductList;
