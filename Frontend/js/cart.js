/* =======================================================================
 * Evenix - Cart (sessionStorage + expiration)
 * Expose: window.EvenixCart
 * Methods:
 *   read()            -> { items, updatedAt, expiresAt }
 *   save(cart)        -> cart
 *   upsert(item)      -> cart        // {id, name, price, qty, meta?}
 *   updateQty(id, q)  -> cart
 *   remove(id)        -> cart
 *   clear()           -> cart
 *   totals()          -> { totalQty, totalHT, currency }
 *   isExpired()       -> boolean
 *   timeLeftMs()      -> number      // ms restantes avant expiration
 *   TTL_MINUTES       -> number      // durée de vie (modifiable)
 * ======================================================================= */

(function (win) {
  "use strict";

  // ====== Configuration ======
  const STORAGE = localStorage;     // -> remplace par localStorage si tu veux persister au-delà de l’onglet
  const KEY     = "evenix_cart_v1";   // -> change le nom si besoin
  let   TTL_MINUTES = 30;             // durée de vie du panier (prolongée à chaque modif)

  // ====== Helpers ======
  const now      = () => Date.now();
  const ttlMs    = () => TTL_MINUTES * 60 * 1000;

  function parseJSON(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }

  // ====== Core ======
  function fresh() {
    const cart = { items: [], updatedAt: now(), expiresAt: now() + ttlMs() };
    STORAGE.setItem(KEY, JSON.stringify(cart));
    return cart;
  }

  function read() {
    const raw = STORAGE.getItem(KEY);
    if (!raw) return fresh();
    const cart = parseJSON(raw, null);
    if (!cart || !Array.isArray(cart.items)) return fresh();

    // Expiration
    if (typeof cart.expiresAt === "number" && cart.expiresAt < now()) {
      console.warn("[EvenixCart] Panier expiré -> réinitialisation");
      return fresh();
    }
    return cart;
  }

  function save(cart) {
    const obj = {
      items: Array.isArray(cart.items) ? cart.items : [],
      updatedAt: now(),
      expiresAt: now() + ttlMs()
    };
    STORAGE.setItem(KEY, JSON.stringify(obj));
    return obj;
  }

  function upsert(item) {
    if (!item || item.id == null) {
      console.warn("[EvenixCart] upsert: item invalide", item);
      return read();
    }
    const cart = read();
    const id   = String(item.id);
    const qty  = Math.max(1, Math.min(999, Number(item.qty || 1)));
    const price = Number(item.price || 0);

    const idx = cart.items.findIndex(i => String(i.id) === id);
    if (idx >= 0) {
      // maj quantité + infos pouvant changer
      cart.items[idx].qty   = Math.min(999, cart.items[idx].qty + qty);
      cart.items[idx].price = price;
      cart.items[idx].name  = item.name ?? cart.items[idx].name;
      cart.items[idx].meta  = item.meta ?? cart.items[idx].meta ?? {};
    } else {
      cart.items.push({
        id,
        name: item.name || "Événement",
        price,
        qty,
        meta: item.meta || {}
      });
    }
    return save(cart);
  }

  function updateQty(id, qty) {
    const cart = read();
    const idx  = cart.items.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return cart;
    const q = Math.max(1, Math.min(999, Number(qty || 1)));
    cart.items[idx].qty = q;
    return save(cart);
  }

  function remove(id) {
    const cart = read();
    cart.items = cart.items.filter(i => String(i.id) !== String(id));
    return save(cart);
  }

  function clear() {
    return save({ items: [], updatedAt: now(), expiresAt: now() + ttlMs() });
  }

  function totals() {
    const cart = read();
    const totalQty = cart.items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    const totalHT  = cart.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0);
    return { totalQty, totalHT, currency: "EUR" };
  }

  function isExpired() {
    const cart = read();
    return typeof cart.expiresAt === "number" && cart.expiresAt < now();
  }

  function timeLeftMs() {
    const cart = read();
    return Math.max(0, (cart.expiresAt || 0) - now());
  }

  // ====== API publique ======
  const API = {
    read,
    save,
    upsert,
    updateQty,
    remove,
    clear,
    totals,
    isExpired,
    timeLeftMs,
    get TTL_MINUTES() { return TTL_MINUTES; },
    set TTL_MINUTES(v) {
      const n = Number(v);
      if (!Number.isFinite(n) || n <= 0) return;
      TTL_MINUTES = Math.floor(n);
      // prolonge le panier actuel pour refléter la nouvelle TTL
      const cart = read();
      save(cart);
    }
  };

  // Expose global
  win.EvenixCart = API;

})(window);
