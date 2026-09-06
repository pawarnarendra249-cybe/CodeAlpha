import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      name: "Home Decoration",
      image: "/images/home-decoration.png",
    },
    {
      name: "Gym Equipment",
      image: "/images/gym-equipment.png",
    },
    {
      name: "Laptop",
      image: "/images/laptop.png",
    },
    {
      name: "Fashion Dress",
      image: "/images/fashion-dress.png",
    },
    {
      name: "Beauty Products",
      image: "/images/beauty-products.png",
    },
  ];

  const featuredImages = [
    "https://static.vecteezy.com/system/resources/previews/024/495/291/non_2x/stylish-and-modern-boho-inspired-living-room-with-carpet-rattan-furniture-pillows-plants-wall-decoration-and-personal-accessories-natural-home-decor-boho-room-interior-ai-generated-image-free-photo.jpg",

    "https://static.vecteezy.com/system/resources/thumbnails/035/234/375/small_2x/ai-generated-gym-equipment-pro-photo.jpg",

    "https://bouttowear.com/cdn/shop/articles/5-fashion-trends-to-look-for-while-shopping-online.png?v=1729963111",

    "https://tse4.mm.bing.net/th/id/OIP.g5D9Y3LUpF6zcmcrfRpu8wHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",

   "https://tse2.mm.bing.net/th/id/OIP.uM1uNMpEcJEJPkJR661xvAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"

  ];

  const [customer, setCustomer] = useState({
    customerName: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item._id === product._id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        customerName: customer.customerName,
        email: customer.email,
        address: customer.address,
      };

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOrderSuccess(data);
      setCart([]);

      setCustomer({
        customerName: "",
        email: "",
        address: "",
      });

      setShowCheckout(false);
      setShowCart(false);
    } catch (error) {
      console.error("Order Error:", error);
      alert("Failed to place order");
    }
  };

  return (
    <div>
      {orderSuccess ? (
        <div className="success-page">
          <div className="success-box">
            <span className="material-symbols-outlined success-icon">
              check_circle
            </span>

            <h1>Order Placed Successfully!</h1>

            <p>Thank you for your order.</p>

            <p>
              Order ID:
              <strong> {orderSuccess._id}</strong>
            </p>

            <p>
              Total Amount:
              <strong> ₹{orderSuccess.totalAmount}</strong>
            </p>

            <button onClick={() => setOrderSuccess(null)}>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TOP BAR */}
          <div className="topbar">
            <span>🚚 Free Delivery on Orders Above ₹999</span>
            <span>🔥 New Deals Every Day</span>
            <span>📦 Easy Returns</span>
          </div>

          {/* MAIN NAVBAR */}
          <nav className="main-navbar">
            <div className="navbar-logo">
              <span className="material-symbols-outlined">
                storefront
              </span>

              <h2>My Store</h2>
            </div>

            <div className="navbar-menu">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();

                  setShowCart(false);
                  setShowCheckout(false);
                  setSelectedCategory(null);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                <span className="material-symbols-outlined">
                  home
                </span>
                Home
              </a>

              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();

                  setShowCart(false);
                  setShowCheckout(false);

                  document
                    .getElementById("products")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <span className="material-symbols-outlined">
                  shopping_bag
                </span>
                Products
              </a>

              <a
                href="#categories"
                onClick={(e) => {
                  e.preventDefault();

                  document
                    .getElementById("categories")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                <span className="material-symbols-outlined">
                  category
                </span>
                Categories
              </a>

              <button
                className="cart-nav-btn"
                onClick={() => {
                  setShowCart(true);
                  setShowCheckout(false);
                }}
              >
                <span className="material-symbols-outlined">
                  shopping_cart
                </span>

                Cart ({cartCount})
              </button>

              <button className="menu-btn">
                <span className="material-symbols-outlined">
                  menu
                </span>
              </button>
            </div>
          </nav>

          {/* OFFER BAR */}
          <div className="offer-bar">
            <div className="offer-content">
              <span>🔥 50% OFF on Fashion Products</span>
              <span>🎉 New Collection Arrived</span>
              <span>💻 Laptop Special Discount</span>
              <span>🏠 Home Decoration Sale</span>
              <span>🏋️ Gym Equipment Offers</span>
            </div>
          </div>

          {!showCart ? (
            <>
              {/* CATEGORY CHIPS */}
              <section
                className="category-chips"
                id="categories"
              >
                <button
                  className={!selectedCategory ? "active" : ""}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>

                {categories.map((category) => (
                  <button
                    key={category.name}
                    className={
                      selectedCategory === category.name
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setSelectedCategory(category.name)
                    }
                  >
                    {category.name}
                  </button>
                ))}
              </section>

              {/* FEATURED PRODUCTS */}
              <section className="categories-section">
                <h2 className="section-title">
                  Featured Products
                </h2>

                <div className="featured-products">
                  {featuredImages.map((image, index) => (
                    <div
                      className="featured-product"
                      key={index}
                    >
                      <img
                        src={image}
                        alt={`Featured Product ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* PRODUCTS */}
              <main id="products">
                <h2 className="section-title">
                  {selectedCategory
                    ? `${selectedCategory} Products`
                    : "Our Products"}
                </h2>

                <div className="product-grid">
                  {products
                    .filter(
                      (product) =>
                        !selectedCategory ||
                        product.category === selectedCategory
                    )
                    .map((product) => (
                      <div
                        className="product-card"
                        key={product._id}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />

                        <div className="product-info">
                          <h3>{product.name}</h3>

                          <p className="category">
                            {product.category}
                          </p>

                          <p>{product.description}</p>

                          <h3>₹{product.price}</h3>

                          <p>Stock: {product.stock}</p>

                          <button
                            onClick={() =>
                              addToCart(product)
                            }
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </main>
            </>
          ) : (
            /* CART */
            <main className="cart-page">
              <h2 className="section-title">
                Shopping Cart
              </h2>

              {cart.length === 0 ? (
                <p className="empty-cart">
                  Your cart is empty.
                </p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div
                        className="cart-item"
                        key={item._id}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                        />

                        <div className="cart-details">
                          <h3>{item.name}</h3>

                          <p>₹{item.price}</p>

                          <div className="quantity">
                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item._id
                                )
                              }
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item._id
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="remove-btn"
                            onClick={() =>
                              removeFromCart(item._id)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total">
                    <h2>Total: ₹{totalPrice}</h2>

                    {!showCheckout && (
                      <button
                        onClick={() =>
                          setShowCheckout(true)
                        }
                      >
                        Proceed to Checkout
                      </button>
                    )}
                  </div>

                  {showCheckout && (
                    <div className="checkout-form">
                      <h2>Checkout</h2>

                      <form onSubmit={handleCheckout}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={customer.customerName}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              customerName:
                                e.target.value,
                            })
                          }
                          required
                        />

                        <input
                          type="email"
                          placeholder="Email"
                          value={customer.email}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              email: e.target.value,
                            })
                          }
                          required
                        />

                        <textarea
                          placeholder="Address"
                          value={customer.address}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              address: e.target.value,
                            })
                          }
                          required
                        />

                        <button type="submit">
                          Place Order
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </main>
          )}
        </>
      )}
    </div>
  );
}

export default App;