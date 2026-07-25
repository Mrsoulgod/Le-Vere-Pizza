(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu toggle */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  /* opening: retract letterbox bars */
  window.addEventListener('load', function(){
    setTimeout(function(){ document.body.classList.add('rolling'); }, reduced ? 0 : 700);
  });
  /* fallback in case load hangs on slow images */
  setTimeout(function(){ document.body.classList.add('rolling'); }, 2500);

  /* nav background on scroll */
  var nav = document.getElementById('nav');
  function onNav(){ 
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40); 
    }
  }
  window.addEventListener('scroll', onNav, {passive:true});
  onNav();

  /* scroll reveals */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* parallax */
  if(!reduced){
    var pxBg = document.querySelector('[data-parallax]');
    var pxImg = document.querySelector('[data-parallax-img]');
    var ticking = false;
    function parallax(){
      var y = window.scrollY;
      if(pxBg && y < window.innerHeight * 1.2){
        pxBg.style.transform = 'translateY(' + (y * 0.18) + 'px)';
      }
      if(pxImg){
        var r = pxImg.parentElement.getBoundingClientRect();
        if(r.top < window.innerHeight && r.bottom > 0){
          var p = (r.top + r.height/2 - window.innerHeight/2) / window.innerHeight;
          pxImg.style.transform = 'translateY(' + (p * -40) + 'px)';
        }
      }
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(parallax); ticking = true; }
    }, {passive:true});
  }

  /* embers animation */
  var cv = document.getElementById('embers');
  if(cv && !reduced){
    var ctx = cv.getContext('2d');
    var W, H, parts = [];
    function size(){
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
    }
    size();
    window.addEventListener('resize', size);
    var COUNT = Math.min(70, Math.floor(window.innerWidth / 18));
    for(var i = 0; i < COUNT; i++){
      parts.push({
        x: Math.random() * 2000,
        y: Math.random() * 1500,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.6 + 0.25,
        vx: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.7 + 0.1,
        tw: Math.random() * 0.02 + 0.005,
        ph: Math.random() * Math.PI * 2
      });
    }
    var t = 0;
    function draw(){
      if(window.scrollY < window.innerHeight){
        ctx.clearRect(0, 0, W, H);
        t += 1;
        for(var i = 0; i < parts.length; i++){
          var p = parts[i];
          p.y -= p.vy;
          p.x += p.vx + Math.sin(t * 0.01 + p.ph) * 0.2;
          if(p.y < -10){ p.y = H + 10; p.x = Math.random() * W; }
          if(p.x < -10) p.x = W + 10;
          if(p.x > W + 10) p.x = -10;
          var alpha = p.a * (0.6 + 0.4 * Math.sin(t * p.tw * 10 + p.ph));
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, 'rgba(233,147,47,' + alpha + ')');
          g.addColorStop(1, 'rgba(179,58,30,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  /* Split parallax scroll for category showcase sticky pin */
  window.addEventListener('scroll', function() {
    var section = document.querySelector('.category-scroll-wrapper');
    if (!section) return;

    var rect = section.getBoundingClientRect();
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    var sectionTop = scrollTop + rect.top;
    var sectionHeight = section.offsetHeight;
    var viewportHeight = window.innerHeight;
    
    var scrollStart = sectionTop;
    var scrollEnd = sectionTop + sectionHeight - viewportHeight;
    
    var index = 0;
    if (scrollTop >= scrollStart && scrollTop <= scrollEnd) {
      var ratio = (scrollTop - scrollStart) / (scrollEnd - scrollStart);
      index = Math.min(3, Math.floor(ratio * 4));
    } else if (scrollTop > scrollEnd) {
      index = 3;
    }
    
    var textBlocks = document.querySelectorAll('.category-text-block');
    var imageBlocks = document.querySelectorAll('.category-image-block');
    var glow = document.getElementById('categoryGlow');
    
    textBlocks.forEach(function(tb, i) {
      tb.classList.toggle('active', i === index);
    });
    imageBlocks.forEach(function(ib, i) {
      ib.classList.toggle('active', i === index);
    });
    
    if (glow) {
      var glowColors = [
        'radial-gradient(circle, rgba(233,147,47,0.12) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(241,196,15,0.12) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(231,76,60,0.12) 0%, transparent 70%)',
        'radial-gradient(circle, rgba(46,204,113,0.12) 0%, transparent 70%)'
      ];
      glow.style.background = glowColors[index];
    }
  }, {passive: true});
})();
