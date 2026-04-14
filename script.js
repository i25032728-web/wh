// ===== 1. Smooth scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===== 2. Scroll reveal animation =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".card, .section, .split").forEach(el=>{
  el.classList.add("hidden");
  observer.observe(el);
});

// ===== 3. Navbar background change on scroll =====
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if(window.scrollY > 50){
    nav.classList.add("scrolled");
  }else{
    nav.classList.remove("scrolled");
  }
});

// ===== 4. Card hover effect =====
document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("mouseenter", ()=>{
    card.style.transform = "translateY(-10px) scale(1.03)";
  });
  card.addEventListener("mouseleave", ()=>{
    card.style.transform = "translateY(0) scale(1)";
  });
});

// ===== 5. QR click alert =====
const qr = document.querySelector(".qr-box img");
if(qr){
  qr.addEventListener("click", ()=>{
    alert("Scan this QR code on your phone to explore more!");
  });
}

// ===== 6. Back to top button =====
const backBtn = document.createElement("button");
backBtn.innerText = "↑";
backBtn.className = "backTop";
document.body.appendChild(backBtn);
backBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
window.addEventListener("scroll", ()=>{
  if(window.scrollY > 300){
    backBtn.style.display = "block";
  }else{
    backBtn.style.display = "none";
  }
});

// ======================= WISHLIST MANAGER (localStorage) =======================
class WishlistManager {
  constructor() {
    this.storageKey = 'nanchang_wishlist';
    this.items = this.load();
    this.updateBadge();
  }
  load() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    this.updateBadge();
    this.renderSidebar();
  }
  add(item) {
    if (!this.items.some(i => i.name === item.name)) {
      this.items.push(item);
      this.save();
      return true;
    }
    return false;
  }
  remove(name) {
    this.items = this.items.filter(i => i.name !== name);
    this.save();
  }
  clear() {
    this.items = [];
    this.save();
  }
  updateBadge() {
    const countSpan = document.getElementById('wishlistCount');
    if(countSpan) countSpan.innerText = this.items.length;
  }
  renderSidebar() {
    const container = document.getElementById('wishlistItems');
    if(!container) return;
    if(this.items.length === 0) {
      container.innerHTML = '<p class="empty-message">Your wishlist is empty. Click the heart button on any card to save your favorite spots.</p>';
      return;
    }
    container.innerHTML = '';
    this.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'wishlist-item';
      const imgHtml = item.img ? `<img src="${item.img}" class="wishlist-item-img" onerror="this.src='images/placeholder.jpg'">` : `<div class="wishlist-item-img" style="background:#ddd; display:flex; align-items:center; justify-content:center;">🌟</div>`;
      div.innerHTML = `
        ${imgHtml}
        <div class="wishlist-item-info">
          <h4>${escapeHtml(item.name)}</h4>
          <p>${escapeHtml(item.desc.substring(0, 80))}</p>
          <button class="remove-item" data-name="${escapeHtml(item.name)}">Remove</button>
        </div>
      `;
      container.appendChild(div);
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = btn.getAttribute('data-name');
        this.remove(name);
        this.renderSidebar();
      });
    });
  }
}
function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }

const wishlist = new WishlistManager();

// Bind all "Add to Wishlist" buttons
function bindWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.removeEventListener('click', wishlistClickHandler);
    btn.addEventListener('click', wishlistClickHandler);
  });
}
function wishlistClickHandler(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const name = btn.getAttribute('data-name');
  const desc = btn.getAttribute('data-desc');
  const img = btn.getAttribute('data-img');
  if(!name) return;
  const added = wishlist.add({ name, desc, img: img || '' });
  showToast(added ? '✅ Added to wishlist!' : '📌 Already in your wishlist');
}
function showToast(msg) {
  let toast = document.querySelector('.dynamic-toast');
  if(!toast) {
    toast = document.createElement('div');
    toast.className = 'dynamic-toast';
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 1800);
}

// Sidebar controls
const sidebar = document.getElementById('wishlistSidebar');
const wishlistIcon = document.getElementById('wishlistIcon');
const closeSidebar = document.getElementById('closeSidebar');
const clearBtn = document.getElementById('clearWishlistBtn');
if(wishlistIcon) {
  wishlistIcon.addEventListener('click', () => {
    wishlist.renderSidebar();
    sidebar.classList.add('open');
  });
}
if(closeSidebar) closeSidebar.addEventListener('click', () => sidebar.classList.remove('open'));
if(clearBtn) clearBtn.addEventListener('click', () => { if(confirm('Clear your entire wishlist?')) wishlist.clear(); });
document.addEventListener('click', (e) => {
  if(sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !wishlistIcon.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ======================= EXIT POPUP (No email) =======================
let exitPopupShown = false;
const popupOverlay = document.getElementById('exitPopup');
const closePopupBtn = document.getElementById('closePopupBtn');
const openWishlistPopupBtn = document.getElementById('openWishlistFromPopup');
const closePopupActionBtn = document.getElementById('closePopupActionBtn');

function showExitPopup() {
  if(exitPopupShown) return;
  exitPopupShown = true;
  if(popupOverlay) popupOverlay.classList.add('active');
}
function hideExitPopup() {
  if(popupOverlay) popupOverlay.classList.remove('active');
}
if(closePopupBtn) closePopupBtn.addEventListener('click', hideExitPopup);
if(closePopupActionBtn) closePopupActionBtn.addEventListener('click', hideExitPopup);
if(openWishlistPopupBtn) {
  openWishlistPopupBtn.addEventListener('click', () => {
    hideExitPopup();
    if(sidebar) {
      wishlist.renderSidebar();
      sidebar.classList.add('open');
    }
  });
}
// Exit-intent detection: mouse leaves the window from the top
let lastMouseY = 0;
document.addEventListener('mousemove', (e) => { lastMouseY = e.clientY; });
document.addEventListener('mouseleave', (e) => {
  if(lastMouseY <= 20 && !exitPopupShown) {
    showExitPopup();
  }
});

// Initialize wishlist buttons after DOM ready and for dynamically added content (though all static)
window.addEventListener('load', () => {
  bindWishlistButtons();
  wishlist.renderSidebar();
});