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
    razaoSocial: "LT LAÍS TORRES ODONTOLOGIA E ESTÉTICA LTDA",
    cnpj: "47.183.038/0001-00",
    crosp: "109221",
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

  // =========================================================================
  // 8. Rastreamento de Tráfego Pago & Cookies (Google Ads, Meta & LGPD)
  // =========================================================================
  const TRACKING_CONFIG = {
    // Insira seu ID do Google Analytics 4 (ex: "G-XXXXXXXXXX")
    googleAnalyticsId: "",
    // Insira seu ID do Google Ads (ex: "AW-XXXXXXXXXX")
    googleAdsId: "",
    // Rótulo da Ação de Conversão no Google Ads para o clique no WhatsApp (ex: "AbCdEfGhIjKlMnOpQr")
    googleAdsWhatsAppConversionLabel: "",
    // Insira seu ID do Pixel da Meta / Facebook (ex: "123456789012345")
    metaPixelId: "",
    // Google Tag Manager ID (ex: "GTM-XXXXXXX")
    googleTagManagerId: ""
  };

  const COOKIE_STORAGE_KEY = 'lt_cookie_consent_preferences';

  // Obter consentimento salvo no localStorage
  const getSavedConsent = () => {
    try {
      const data = localStorage.getItem(COOKIE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  // Salvar consentimento e atualizar tags
  const saveConsent = (preferences) => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify({
        ...preferences,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {}

    // Atualiza o Google Consent Mode v2 dinamicamente
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_user_data': preferences.marketing ? 'granted' : 'denied',
        'ad_personalization': preferences.marketing ? 'granted' : 'denied'
      });
    }

    // Inicializa Meta Pixel se o consentimento de marketing for concedido
    if (preferences.marketing && TRACKING_CONFIG.metaPixelId && typeof fbq === 'function') {
      fbq('init', TRACKING_CONFIG.metaPixelId);
      fbq('track', 'PageView');
    }

    // Dispara evento de consentimento atualizado no DataLayer (para GTM)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'cookie_consent_updated',
      'consent_analytics': preferences.analytics,
      'consent_marketing': preferences.marketing
    });
  };

  // Elementos do Banner e Modal de Cookies
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieModal = document.getElementById('cookieModalBackdrop');
  const cookiePrivacyTrigger = document.getElementById('cookiePrivacyTrigger');
  const btnAcceptAll = document.getElementById('btnAcceptAllCookies');
  const btnAcceptEssential = document.getElementById('btnAcceptEssentialCookies');
  const btnOpenModal = document.getElementById('btnOpenCookieModal');
  const btnCloseModal = document.getElementById('btnCloseCookieModal');
  const btnSaveModal = document.getElementById('btnSaveCookiePreferences');
  const btnModalAcceptAll = document.getElementById('btnModalAcceptAll');
  const openCookieSettingsBtn = document.getElementById('openCookieSettingsBtn');
  const openCookieSettingsNavBtn = document.getElementById('openCookieSettingsNavBtn');
  const openCookieSettingsFromPolicy = document.getElementById('openCookieSettingsFromPolicy');

  const chkAnalytics = document.getElementById('cookieAnalytics');
  const chkMarketing = document.getElementById('cookieMarketing');

  // Abre a janela de preferências
  const openModal = () => {
    const current = getSavedConsent() || { analytics: true, marketing: true };
    if (chkAnalytics) chkAnalytics.checked = current.analytics !== false;
    if (chkMarketing) chkMarketing.checked = current.marketing !== false;
    if (cookieModal) {
      cookieModal.classList.add('show');
      cookieModal.setAttribute('aria-hidden', 'false');
    }
  };

  // Fecha a janela de preferências
  const closeModal = () => {
    if (cookieModal) {
      cookieModal.classList.remove('show');
      cookieModal.setAttribute('aria-hidden', 'true');
    }
  };

  // Esconde o banner de aviso
  const hideBanner = () => {
    if (cookieBanner) {
      cookieBanner.classList.remove('show');
      cookieBanner.setAttribute('aria-hidden', 'true');
    }
    if (cookiePrivacyTrigger) {
      cookiePrivacyTrigger.style.display = 'inline-flex';
    }
  };

  // Inicialização do estado de cookies na carga da página
  const savedConsent = getSavedConsent();
  if (!savedConsent) {
    // Usuário novo: exibe o banner de cookies
    if (cookieBanner) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
        cookieBanner.setAttribute('aria-hidden', 'false');
      }, 700);
    }
  } else {
    // Já possui consentimento salvo: aplica às tags e exibe o botão discreto de privacidade
    saveConsent(savedConsent);
    if (cookiePrivacyTrigger) {
      cookiePrivacyTrigger.style.display = 'inline-flex';
    }
  }

  // Eventos de clique nos botões de aceitação
  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', () => {
      saveConsent({ essential: true, analytics: true, marketing: true });
      hideBanner();
      showToast("Preferências de cookies salvas. Obrigado!");
    });
  }

  if (btnAcceptEssential) {
    btnAcceptEssential.addEventListener('click', () => {
      saveConsent({ essential: true, analytics: false, marketing: false });
      hideBanner();
      showToast("Apenas cookies necessários foram ativados.");
    });
  }

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', openModal);
  }

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  if (cookieModal) {
    cookieModal.addEventListener('click', (e) => {
      if (e.target === cookieModal) closeModal();
    });
  }

  if (btnSaveModal) {
    btnSaveModal.addEventListener('click', () => {
      const preferences = {
        essential: true,
        analytics: chkAnalytics ? chkAnalytics.checked : false,
        marketing: chkMarketing ? chkMarketing.checked : false
      };
      saveConsent(preferences);
      closeModal();
      hideBanner();
      showToast("Preferências de cookies salvas com sucesso!");
    });
  }

  if (btnModalAcceptAll) {
    btnModalAcceptAll.addEventListener('click', () => {
      if (chkAnalytics) chkAnalytics.checked = true;
      if (chkMarketing) chkMarketing.checked = true;
      saveConsent({ essential: true, analytics: true, marketing: true });
      closeModal();
      hideBanner();
      showToast("Todos os cookies foram aceitos!");
    });
  }

  if (cookiePrivacyTrigger) {
    cookiePrivacyTrigger.addEventListener('click', openModal);
  }

  if (openCookieSettingsBtn) {
    openCookieSettingsBtn.addEventListener('click', openModal);
  }

  if (openCookieSettingsNavBtn) {
    openCookieSettingsNavBtn.addEventListener('click', openModal);
  }

  if (openCookieSettingsFromPolicy) {
    openCookieSettingsFromPolicy.addEventListener('click', openModal);
  }

  // =========================================================================
  // 9. Disparo de Conversões no WhatsApp (Google Ads & Meta Pixel Lead)
  // =========================================================================
  const setupWhatsAppConversionTracking = () => {
    const whatsappElements = document.querySelectorAll('.cta-whatsapp, .floating-whatsapp-btn, a[href*="wa.me"]');

    whatsappElements.forEach(element => {
      element.addEventListener('click', () => {
        const consent = getSavedConsent();

        // 1. DataLayer Event (compatível com Google Tag Manager)
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'whatsapp_lead_click',
          'lead_source': 'landing_page',
          'lead_clinic': CLINIC_CONFIG.clinicName
        });

        // 2. Disparos se houver consentimento de marketing ativo
        if (!consent || consent.marketing !== false) {
          // Meta Pixel Evento 'Lead'
          if (typeof fbq === 'function') {
            fbq('track', 'Lead', {
              content_name: 'Clique Botão WhatsApp',
              content_category: 'Agendamento Estética Facial',
              currency: 'BRL'
            });
          }

          // Google Analytics 4 Evento 'generate_lead'
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              'event_category': 'WhatsApp',
              'event_label': 'Agendamento Consulta Santo André'
            });

            // Google Ads Conversão Específica
            if (TRACKING_CONFIG.googleAdsId && TRACKING_CONFIG.googleAdsWhatsAppConversionLabel) {
              gtag('event', 'conversion', {
                'send_to': `${TRACKING_CONFIG.googleAdsId}/${TRACKING_CONFIG.googleAdsWhatsAppConversionLabel}`
              });
            }
          }

          console.log("%c [Tracking] Lead disparado com sucesso no WhatsApp ", "background: #25D366; color: #fff; padding: 2px 6px; border-radius: 3px; font-weight: bold;");
        }
      });
    });
  };

  setupWhatsAppConversionTracking();

  // =========================================================================
  // 10. Casos Clínicos (Antes e Depois) - Lightbox & Toggle Mais Casos
  // =========================================================================
  const caseWrappers = document.querySelectorAll('.case-image-wrapper');
  const caseLightbox = document.getElementById('caseLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  if (caseLightbox && lightboxImg && lightboxTitle) {
    const openLightbox = (imgSrc, caption) => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
      lightboxTitle.textContent = caption;
      caseLightbox.classList.add('show');
      caseLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      caseLightbox.classList.remove('show');
      caseLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 250);
    };

    caseWrappers.forEach(wrap => {
      wrap.addEventListener('click', () => {
        const fullImg = wrap.getAttribute('data-full-img');
        const caption = wrap.getAttribute('data-caption') || 'Caso Clínico — Dra. Laís Torres';
        if (fullImg) openLightbox(fullImg, caption);
      });
    });

    if (btnCloseLightbox) {
      btnCloseLightbox.addEventListener('click', closeLightbox);
    }

    caseLightbox.addEventListener('click', (e) => {
      if (e.target === caseLightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && caseLightbox.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

  // Toggle de Casos Adicionais
  const btnToggleMoreCases = document.getElementById('btnToggleMoreCases');
  const additionalCasesGrid = document.getElementById('additionalCasesGrid');

  if (btnToggleMoreCases && additionalCasesGrid) {
    btnToggleMoreCases.addEventListener('click', () => {
      const isExpanded = btnToggleMoreCases.getAttribute('aria-expanded') === 'true';
      if (!isExpanded) {
        additionalCasesGrid.style.display = 'grid';
        btnToggleMoreCases.setAttribute('aria-expanded', 'true');
        btnToggleMoreCases.querySelector('span').textContent = 'Recolher Casos Clínicos';
      } else {
        additionalCasesGrid.style.display = 'none';
        btnToggleMoreCases.setAttribute('aria-expanded', 'false');
        btnToggleMoreCases.querySelector('span').textContent = 'Ver Mais Casos Clínicos de Perfil e Lábios (+2)';
      }
    });
  }

  // Log informativo para o desenvolvedor
  console.log("%c Dra. Laís Torres | Landing Page, Cookies & Casos Clínicos Carregados ", "background: #C5A880; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
});
