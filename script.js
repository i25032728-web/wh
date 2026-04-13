// ===== 1. 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if(target){
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});


// ===== 2. 滚动渐显动画 =====
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


// ===== 3. Navbar 滚动变色 =====
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if(window.scrollY > 50){
    nav.classList.add("scrolled");
  }else{
    nav.classList.remove("scrolled");
  }
});


// ===== 4. 卡片 Hover 动态增强 =====
document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("mouseenter", ()=>{
    card.style.transform = "translateY(-10px) scale(1.03)";
  });

  card.addEventListener("mouseleave", ()=>{
    card.style.transform = "translateY(0) scale(1)";
  });
});


// ===== 5. QR 点击提示 =====
const qr = document.querySelector(".qr-box img");
if(qr){
  qr.addEventListener("click", ()=>{
    alert("Scan this QR code on your phone to explore more!");
  });
}


// ===== 6. 返回顶部按钮 =====
const btn = document.createElement("button");
btn.innerText = "↑";
btn.className = "backTop";
document.body.appendChild(btn);

btn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.addEventListener("scroll", ()=>{
  if(window.scrollY > 300){
    btn.style.display = "block";
  }else{
    btn.style.display = "none";
  }
});