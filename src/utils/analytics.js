export const GA_MEASUREMENT_ID = "G-QTT800H4HR";

export const pageView = (path) => {
  if (!window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: GA_MEASUREMENT_ID,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag) return;

  window.gtag("event", eventName, params);
};

export const trackViewItem = ({ item_id, item_name, price, category }) => {
  if (!window.gtag) return;

  window.gtag("event", "view_item", {
    currency: "INR",
    value: price || 0,
    items: [
      {
        item_id,
        item_name,
        price,
        item_category: category || "Aquarium",
        quantity: 1,
      },
    ],
  });
};

export const trackAddToCart = ({ item_id, item_name, price, quantity = 1, category }) => {
  if (!window.gtag) return;

  window.gtag("event", "add_to_cart", {
    currency: "INR",
    value: (price || 0) * quantity,
    items: [
      {
        item_id,
        item_name,
        price,
        quantity,
        item_category: category || "Aquarium",
      },
    ],
  });
};

export const trackBeginCheckout = (items = [], value = 0) => {
  if (!window.gtag) return;

  window.gtag("event", "begin_checkout", {
    currency: "INR",
    value,
    items,
  });
};

export const trackPurchase = ({
  transaction_id,
  value,
  shipping = 0,
  items = [],
}) => {
  if (!window.gtag) return;

  window.gtag("event", "purchase", {
    transaction_id,
    currency: "INR",
    value,
    shipping,
    items,
  });
};