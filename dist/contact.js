const $=(selector,scope=document)=>scope.querySelector(selector);
const header=$('.site-header');
const mobileMenu=$('#contact-mobile-menu');
const menuToggle=$('.menu-toggle');
function updateHeader(){header?.classList.toggle('is-glass',scrollY>24)}
updateHeader();
addEventListener('scroll',updateHeader,{passive:true});
menuToggle?.addEventListener('click',()=>{mobileMenu?.showModal();menuToggle.setAttribute('aria-expanded','true')});
$('.menu-close')?.addEventListener('click',()=>mobileMenu?.close());
mobileMenu?.addEventListener('click',event=>{if(event.target===mobileMenu)mobileMenu.close()});
mobileMenu?.addEventListener('close',()=>menuToggle?.setAttribute('aria-expanded','false'));
