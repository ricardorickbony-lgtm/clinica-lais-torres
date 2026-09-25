/**
 * Dra. Laís Torres - Landing Page
 * Interatividade, UX, Carousel, FAQ Accordion e Utilitários de Conversão
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Configurações Globais Editáveis (WhatsApp e Dados Comerciais)
  // =========================================================================
  const CLINIC_CONFIG = {
    // Altere este número para o WhatsApp comercial oficial (formato internacional sem + ou traços)
    // Ex: "5511987654321"
    whatsappNumber: "5511992108168",
    clinicName: "Dra. Laís Torres - Harmonização Orofacial",
    addressText: "Av. Palmares, 884, Loja 02 - Vila Palmares, Santo André – SP, CEP 09061-410",
    defaultMessage: "Olá, Dra. Laís Torres! Vim pelo site oficial e gostaria de agendar uma consulta de avaliação em Santo André."
  };

  // Atualiza dinamicamente todos os links de WhatsApp caso o número seja alterado no config
  const updateWhatsAppLinks = () => {
    const whatsappButtons = document.querySelectorAll('.cta-whatsapp');
    whatsappButtons.forEach(btn => {
      const currentHref = btn.getAttribute('href');
      if (currentHref && currentHref.includes('wa.me')) {
        const url = new URL(currentHref);
        const textParam = url.searchParams.get('text') || encodeURIComponent(CLINIC_CONFIG.defaultMessage);
        btn.setAttribute('href', `https://wa.me/${CLINIC_CONFIG.whatsappNumber}?text=${textParam}`);
      }
    });

    const floatingBtn = document.querySelector('.floating-whatsapp-btn');
    if (floatingBtn) {
      floatingBtn.setAttribute('href', `https://wa.me/${CLINIC_CONFIG.whatsappNumber}?text=${encodeURIComponent(CLINIC_CONFIG.defaultMessage)}`);
    }
  };
  updateWhatsAppLinks();

  // =========================================================================
  // 2. Sticky Header com efeito de Glassmorphism ao Scrollar
  // =========================================================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // =========================================================================
  // 3. Menu Mobile Drawer Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha o menu ao clicar em qualquer link de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 4. Accordion Interativo de Perguntas Frequentes (FAQ)
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha todos os outros itens para manter o accordion limpo
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // Alterna o estado do item clicado
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // =========================================================================
  // 5. Carrossel de Depoimentos (Google Reviews)
  // =========================================================================
  const testimonials = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  const dotsContainer = document.getElementById('sliderDots');
  let currentReview = 0;

  if (testimonials.length > 0 && dotsContainer) {
    // Configura os dots indicadores
    const dots = dotsContainer.querySelectorAll('.dot');

    const updateSlider = (index) => {
      // Ajuste para telas pequenas onde apenas um card é mostrado por vez
      if (window.innerWidth <= 1024) {
        testimonials.forEach((card, idx) => {
          card.style.display = idx === index ? 'flex' : 'none';
        });
      } else {
        testimonials.forEach(card => {
          card.style.display = 'flex';
        });
      }

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
      currentReview = index;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        let newIdx = currentReview - 1;
        if (newIdx < 0) newIdx = testimonials.length - 1;
        updateSlider(newIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        let newIdx = currentReview + 1;
        if (newIdx >= testimonials.length) newIdx = 0;
        updateSlider(newIdx);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateSlider(idx);
      });
    });

    // Responsividade do Slider ao redimensionar tela
    window.addEventListener('resize', () => {
      updateSlider(currentReview);
    });

    // Inicialização
    updateSlider(0);
  }

  // =========================================================================
  // 6. Copiar Endereço para a Área de Transferência & Toast
  // =========================================================================
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  const showToast = (message) => {
    if (!toastNotification) return;
    toastMsg.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  };

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CLINIC_CONFIG.addressText);
        showToast("Endereço copiado para a área de transferência!");
      } catch (err) {
        // Fallback para navegadores sem permissão de clipboard
        const tempInput = document.createElement("input");
        tempInput.value = CLINIC_CONFIG.addressText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Endereço copiado com sucesso!");
      }
    });
  }

  // =========================================================================
  // 7. Smooth Scroll com Offset para Links Âncora
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Log informativo para o desenvolvedor
  console.log("%c Dra. Laís Torres | Landing Page Carregada ", "background: #C5A880; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
});
