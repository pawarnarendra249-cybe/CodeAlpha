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
      icon: "home",
    },
    {
      name: "Gym Equipment",
      image: "/images/gym-equipment.png",
      icon: "fitness_center",
    },
    {
      name: "Laptop",
      image: "/images/laptop.png",
      icon: "laptop",
    },
    {
      name: "Fashion Dress",
      image: "/images/fashion-dress.png",
      icon: "checkroom",
    },
    {
      name: "Beauty Products",
      image: "/images/beauty-products.png",
      icon: "spa",
    },
  ];

  const featuredImages = [
    "https://static.vecteezy.com/system/resources/previews/024/495/291/non_2x/stylish-and-modern-boho-inspired-living-room-with-carpet-rattan-furniture-pillows-plants-wall-decoration-and-personal-accessories-natural-home-decor-boho-room-interior-ai-generated-image-free-photo.jpg",
    "https://static.vecteezy.com/system/resources/thumbnails/035/234/375/small_2x/ai-generated-gym-equipment-pro-photo.jpg",
    "https://bouttowear.com/cdn/shop/articles/5-fashion-trends-to-look-for-while-shopping-online.png?v=1729963111",
    "https://tse4.mm.bing.net/th/id/OIP.g5D9Y3LUpF6zcmcrfRpu8wHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://tse2.mm.bing.net/th/id/OIP.uM1uNMpEcJEJPkJR661xvAAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
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

  const goHome = () => {
    setShowCart(false);
    setShowCheckout(false);
    setSelectedCategory(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goProducts = () => {
    setShowCart(false);
    setShowCheckout(false);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  const goCategories = () => {
    setShowCart(false);
    setShowCheckout(false);

    setTimeout(() => {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
  };

  if (orderSuccess) {
    return (
      <div className="success-page">
        <div className="success-box">
          <div className="success-circle">
            <span className="material-symbols-outlined">
              check
            </span>
          </div>

          <span className="success-label">ORDER CONFIRMED</span>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with <strong>Baazaar</strong>.
          </p>

          <div className="order-summary">
            <div>
              <span>Order ID</span>
              <strong>{orderSuccess._id}</strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>₹{orderSuccess.totalAmount}</strong>
            </div>
          </div>

          <button
            className="primary-btn"
            onClick={() => setOrderSuccess(null)}
          >
            <span className="material-symbols-outlined">
              shopping_bag
            </span>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* TOP BAR */}
      <div className="topbar">
        <div>
          <span>🚚 Free Delivery on Orders Above ₹999</span>
        </div>

        <div className="topbar-right">
          <span>Easy Returns</span>
          <span>Secure Shopping</span>
          <span>24/7 Support</span>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="main-navbar">
        <button className="brand" onClick={goHome}>
          <div className="brand-icon">
            <span className="material-symbols-outlined">
              storefront
            </span>
          </div>

          <div>
            <h1>BAAZAAR</h1>
            <span>SHOP • CHOOSE • ENJOY</span>
          </div>
        </button>

        <div className="navbar-menu">
          <button
            className="nav-link active"
            onClick={goHome}
          >
            <span className="material-symbols-outlined">
              home
            </span>
            Home
          </button>

          <button
            className="nav-link"
            onClick={goProducts}
          >
            <span className="material-symbols-outlined">
              shopping_bag
            </span>
            Products
          </button>

          <button
            className="nav-link"
            onClick={goCategories}
          >
            <span className="material-symbols-outlined">
              category
            </span>
            Categories
          </button>

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

            <span>Cart</span>

            {cartCount > 0 && (
              <b>{cartCount}</b>
            )}
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
          <span>🔥 50% OFF ON FASHION</span>
          <span>💻 LAPTOP SPECIAL DEALS</span>
          <span>🏠 HOME DECORATION SALE</span>
          <span>🏋️ GYM EQUIPMENT OFFERS</span>
          <span>✨ NEW COLLECTION ARRIVED</span>
        </div>
      </div>

      {!showCart ? (
        <>
          {/* HERO */}
          <section className="hero-section">
            <div className="hero-content">
              <span className="hero-tag">
                ✨ EVERYTHING YOU NEED, ALL IN ONE PLACE
              </span>

              <h1>
                Shop Smart.
                <br />
                <span>Live Better.</span>
              </h1>

              <p>
                Discover quality products, amazing deals and
                everyday essentials — all at one place.
              </p>

              <div className="hero-buttons">
                <button
                  className="hero-primary"
                  onClick={goProducts}
                >
                  Shop Now
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>

                <button
                  className="hero-secondary"
                  onClick={goCategories}
                >
                  Explore Categories
                </button>
              </div>

              <div className="hero-stats">
                <div>
                  <strong>500+</strong>
                  <span>Products</span>
                </div>

                <div>
                  <strong>5</strong>
                  <span>Categories</span>
                </div>

                <div>
                  <strong>100%</strong>
                  <span>Secure</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-card hero-card-main">
                <img
                  src={featuredImages[0]}
                  alt="Home Decoration"
                />
              </div>

              <div className="floating-card floating-one">
                <span className="material-symbols-outlined">
                  local_shipping
                </span>
                <div>
                  <strong>Free Delivery</strong>
                  <small>Orders above ₹999</small>
                </div>
              </div>

              <div className="floating-card floating-two">
                <strong>50%</strong>
                <span>OFF</span>
              </div>
            </div>
          </section>

         

          {/* FEATURED */}
          <section className="featured-section">
            <div className="featured-header">
              <div>
                <span className="eyebrow">
                  TRENDING NOW
                </span>

                <h2>Featured Collection</h2>
              </div>

              <button onClick={goProducts}>
                View All
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>
            </div>

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

                  <div className="featured-overlay">
                    <span>EXPLORE</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRODUCTS */}
          <main
            className="products-section"
            id="products"
          >
            <div className="products-heading">
              <div>
                <span className="eyebrow">
                  OUR COLLECTION
                </span>

                <h2>
                  {selectedCategory
                    ? selectedCategory
                    : "Popular Products"}
                </h2>
              </div>

              <span className="product-count">
                {
                  products.filter(
                    (product) =>
                      !selectedCategory ||
                      product.category === selectedCategory
                  ).length
                }{" "}
                Products
              </span>
            </div>

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
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                      />

                      <span className="product-badge">
                        NEW
                      </span>
                    </div>

                    <div className="product-info">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p className="product-description">
                        {product.description}
                      </p>

                      <div className="product-bottom">
                        <div>
                          <span className="price">
                            ₹{product.price}
                          </span>

                          <span className="stock">
                            {product.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>

                        <button
                          className="add-cart-btn"
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          <span className="material-symbols-outlined">
                            add_shopping_cart
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {products.filter(
              (product) =>
                !selectedCategory ||
                product.category === selectedCategory
            ).length === 0 && (
              <div className="no-products">
                <span className="material-symbols-outlined">
                  inventory_2
                </span>
                <h3>No products found</h3>
                <p>Try another category.</p>
              </div>
            )}
          </main>
        </>
      ) : (
        /* CART */
        <main className="cart-page">
          <button
            className="back-shopping"
            onClick={goHome}
          >
            <span className="material-symbols-outlined">
              arrow_back
            </span>
            Continue Shopping
          </button>

          <div className="cart-header">
            <div>
              <span className="eyebrow">YOUR BAG</span>
              <h1>Shopping Cart</h1>
            </div>

            <span>{cartCount} Items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <span className="material-symbols-outlined">
                  shopping_cart
                </span>
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Looks like you haven't added anything yet.
              </p>

              <button
                className="primary-btn"
                onClick={goHome}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-layout">
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
                      <span>{item.category}</span>

                      <h3>{item.name}</h3>

                      <p>₹{item.price}</p>

                      <div className="cart-actions">
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
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong className="item-total">
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>

              <aside className="cart-summary">
                <span className="eyebrow">ORDER SUMMARY</span>

                <h2>Summary</h2>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{totalPrice}</strong>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <strong>
                    {totalPrice >= 999 ? "FREE" : "₹49"}
                  </strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total</span>
                  <strong>
                    ₹
                    {totalPrice >= 999
                      ? totalPrice
                      : totalPrice + 49}
                  </strong>
                </div>

                {!showCheckout && (
                  <button
                    className="checkout-btn"
                    onClick={() =>
                      setShowCheckout(true)
                    }
                  >
                    Proceed to Checkout
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>
                )}

                <div className="secure-note">
                  <span className="material-symbols-outlined">
                    lock
                  </span>
                  Secure & encrypted checkout
                </div>
              </aside>
            </div>
          )}

          {showCheckout && cart.length > 0 && (
            <div className="checkout-form">
              <div className="checkout-heading">
                <span className="eyebrow">FINAL STEP</span>
                <h2>Complete Your Order</h2>
                <p>
                  Enter your details to place the order.
                </p>
              </div>

              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
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
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    placeholder="Enter your complete delivery address"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="checkout-buttons">
                  <button
                    type="button"
                    className="cancel-checkout"
                    onClick={() =>
                      setShowCheckout(false)
                    }
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className="place-order-btn"
                  >
                    Place Order
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      )}

      {/* FOOTER */}
      {!showCart && (
        <footer className="footer">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="material-symbols-outlined">
                  storefront
                </span>
                BAAZAAR
              </div>

              <p>
                Your everyday shopping destination for
                quality products and great deals.
              </p>
            </div>

            <div className="footer-column">
              <h4>Shop</h4>
              <button onClick={goProducts}>
                All Products
              </button>
              <button onClick={goCategories}>
                Categories
              </button>
            </div>

            <div className="footer-column">
              <h4>Help</h4>
              <span>Easy Returns</span>
              <span>Secure Shopping</span>
              <span>Customer Support</span>
            </div>

            <div className="footer-column">
              <h4>Categories</h4>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    setSelectedCategory(category.name)
                  }
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Baazaar. All rights reserved.</span>
            <span>Made for smart shoppers.</span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

