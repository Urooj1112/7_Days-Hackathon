"use client";
import { useEffect, useState } from "react";
import { FaTrash, FaHeart } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
  productImage: {
    asset: {
      _ref: string;
    };
  };
}

const CartPage = () => {
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart: Product[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Handle quantity change (increase or decrease)
  const handleQuantityChange = (index: number, action: "increase" | "decrease") => {
    const updatedCart = [...cart];
    if (action === "increase") {
      updatedCart[index].quantity += 1;
    } else if (action === "decrease" && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate the total price
  const calculateTotal = () => {
    let totalPrice = 0;
    cart.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });
    return totalPrice;
  };

  const totalPrice = calculateTotal();
  const freeDeliveryThreshold = 5000;
  const deliveryCharges = totalPrice >= freeDeliveryThreshold ? 0 : 100;
  const totalAmount = totalPrice + deliveryCharges;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="w-full bg-blue-100 p-4 rounded-md mb-8 flex justify-center items-center">
        <p className="text-md text-black text-center">
          Free Delivery applies to orders of $5000 or more. {" "}
          <Link href="/Shop" className="text-black">
            View details
          </Link>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl text-[#252B42] font-bold">Bandage</h2>
      </div>

      {cart.length === 0 ? (
        <div className="flex items-center justify-center text-2xl h-60 flex-col">
          <p>Your cart is empty.</p>
          <Link href="/Shop" className="text-[#23A6F0] mt-2">Go to Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            {cart.map((product, index) => (
              <div key={product.id} className="flex items-center py-4 border-b">
                <div className="w-1/4 sm:w-1/5">
                  <img
                    src={urlFor(product.productImage?.asset._ref).url()}
                    alt={product.title}
                    width={100}
                    height={100}
                    className="mb-2"
                  />
                </div>
                <div className="w-1/2 sm:w-2/5">
                  <h2 className="text-xl font-bold">{product.title}</h2>
                  <div className="flex space-x-2">
                    <FaHeart className="text-red-500" />
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="w-1/4 sm:w-1/5 flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(index, "decrease")}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-semibold">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(index, "increase")}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <div className="w-1/4 sm:w-1/5">
                  <p className="font-semibold">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-1 bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
            <div className="flex justify-between mb-4">
              <p>Subtotal:</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p>Delivery Charges:</p>
              <p>${deliveryCharges.toFixed(2)}</p>
            </div>
            <div className="flex justify-between mb-4 font-semibold text-lg">
              <p>Total:</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/CheckOut">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;