import { mockProducts as initialMockProducts } from "../data/mockProducts.js";

const PRODUCTS_KEY = "minashop_products";
const USERS_KEY = "minashop_users";
const CART_KEY = "minashop_cart_";
const ADDRESS_KEY = "minashop_addresses_";

// --- Products Service ---
export const mockProductsService = {
  getProducts: (search = "", category = "") => {
    let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "null");
    if (!products || products.length === 0) {
      products = [...initialMockProducts];
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    }

    let filtered = [...products];
    if (search) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    return filtered;
  },

  getProductById: (id) => {
    const products = mockProductsService.getProducts();
    return products.find((p) => p._id === id) || products[0];
  },

  addProduct: (productData) => {
    const products = mockProductsService.getProducts();
    const newProduct = {
      _id: "prod_" + Date.now(),
      ...productData,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct: (id, updates) => {
    const products = mockProductsService.getProducts();
    const idx = products.findIndex((p) => p._id === id);
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        ...updates,
        price: Number(updates.price) || products[idx].price,
        stock: Number(updates.stock) || products[idx].stock,
      };
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return products[idx];
    }
    return null;
  },

  deleteProduct: (id) => {
    let products = mockProductsService.getProducts();
    products = products.filter((p) => p._id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return true;
  },
};

// --- Auth Service ---
export const mockAuth = {
  signup: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists");
    }
    const newUser = {
      id: "usr_" + Date.now(),
      name: userData.name || "Customer",
      email: userData.email,
      password: userData.password,
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return {
      message: "Account created successfully! Please login.",
      user: newUser,
    };
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Auto-create or login seamlessly for demo evaluation
    if (!user) {
      user = {
        id: "usr_" + Date.now(),
        name: email.split("@")[0],
        email: email,
        password: password,
      };
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const token = "demo_token_" + Math.random().toString(36).substring(2);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: "Login Successful",
    };
  },
};

// --- Cart Service ---
export const mockCartService = {
  getCart: (userId = "guest") => {
    const raw = localStorage.getItem(CART_KEY + userId);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // invalid JSON
      }
    }
    return { userId, items: [] };
  },

  addItem: (userId = "guest", productId) => {
    const cart = mockCartService.getCart(userId);
    const existing = cart.items.find(
      (i) => (i.productId?._id || i.productId) === productId
    );
    const allProducts = mockProductsService.getProducts();
    const productObj =
      allProducts.find((p) => p._id === productId) || {
        _id: productId,
        title: "Item",
        price: 999,
        image: "",
      };

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ productId: productObj, quantity: 1 });
    }

    localStorage.setItem(CART_KEY + userId, JSON.stringify(cart));
    const totalCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    localStorage.setItem("cartCount", totalCount);
    window.dispatchEvent(new Event("cartUpdated"));
    return cart;
  },

  updateQty: (userId = "guest", productId, quantity) => {
    const cart = mockCartService.getCart(userId);
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => (i.productId?._id || i.productId) !== productId
      );
    } else {
      const item = cart.items.find(
        (i) => (i.productId?._id || i.productId) === productId
      );
      if (item) {
        item.quantity = quantity;
      }
    }

    localStorage.setItem(CART_KEY + userId, JSON.stringify(cart));
    const totalCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    localStorage.setItem("cartCount", totalCount);
    window.dispatchEvent(new Event("cartUpdated"));
    return cart;
  },

  removeItem: (userId = "guest", productId) => {
    return mockCartService.updateQty(userId, productId, 0);
  },

  clearCart: (userId = "guest") => {
    const emptyCart = { userId, items: [] };
    localStorage.setItem(CART_KEY + userId, JSON.stringify(emptyCart));
    localStorage.setItem("cartCount", 0);
    window.dispatchEvent(new Event("cartUpdated"));
    return emptyCart;
  },
};

// --- Address Service ---
export const mockAddressService = {
  getAddresses: (userId = "guest") => {
    const raw = localStorage.getItem(ADDRESS_KEY + userId);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [
      {
        _id: "addr_default_1",
        fullName: "Minakshi Jha",
        phone: "+91 9876543210",
        addressLine: "Tech Park, Phase 1",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560100",
      },
    ];
  },

  saveAddress: (userId = "guest", addressData) => {
    const addresses = mockAddressService.getAddresses(userId);
    const newAddr = {
      _id: "addr_" + Date.now(),
      ...addressData,
    };
    addresses.push(newAddr);
    localStorage.setItem(ADDRESS_KEY + userId, JSON.stringify(addresses));
    return newAddr;
  },
};

// --- Order Service ---
export const mockOrderService = {
  placeOrder: (userId = "guest", address) => {
    const cart = mockCartService.getCart(userId);
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const order = {
      orderId,
      userId,
      address,
      items: [...cart.items],
      createdAt: new Date().toISOString(),
    };
    mockCartService.clearCart(userId);
    return order;
  },
};
