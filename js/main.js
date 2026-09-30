/**
 * Dra. Laís Torres - Landing Page
 * Interatividade, UX, Carousel, FAQ Accordion e Utilitários de Conversão
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Configurações Globais Editáveis (WhatsApp e Dados Comerciais)
  // =========================================================================
  const CLINIC_CONFIG = {
    whatsappNumber: "5511992108168",
    clinicName: "Dra. Laís Torres - Harmonização Orofacial",
    razaoSocial: "LT LAÍS TORRES ODONTOLOGIA E ESTÉTICA LTDA",
    cnpj: "47.183.038/0001-00",
    crosp: "109221",
    addressText: "Av. Palmares, 884, Loja 02 - Vila Palmares, Santo André – SP, CEP 09061-410",
    defaultMessage: "Olá, Dra. Laís Torres! Vim pelo site oficial e gostaria de agendar uma consulta de avaliação em Santo André.",
    // Horários Oficiais sincronizados com Google Meu Negócio e Recepção
    schedule: {
      timezone: "America/Sao_Paulo",
      // Segunda a Sexta: 09:00 às 18:30 (540 a 1110 minutos a partir de 00:00)
      weekdayOpen: 9 * 60,
      weekdayClose: 18 * 60 + 30,
      // Sábado: 09:00 às 13:00 (540 a 780 minutos)
      saturdayOpen: 9 * 60,
      saturdayClose: 13 * 60
    }
  };

  // Atualiza dinamicamente todos os links de WhatsApp caso o número seja alterado no config
  const updateWhatsAppLinks = () => {
    const whatsappButtons = document.querySelectorAll('.cta-whatsapp:not(#btnConciergeAction)');
    whatsappButtons.forEach(btn => {
      const currentHref = btn.getAttribute('href');
      if (currentHref && currentHref.includes('wa.me')) {
        const url = new URL(currentHref);
        const textParam = url.searchParams.get('text') || encodeURIComponent(CLINIC_CONFIG.defaultMessage);
        btn.setAttribute('href', `https://wa.me/${CLINIC_CONFIG.whatsappNumber}?text=${textParam}`);
      }
    });
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
    let lastFocusedTrigger = null;

    const openLightbox = (imgSrc, caption, triggerEl) => {
      lastFocusedTrigger = triggerEl || document.activeElement;
      lightboxImg.src = imgSrc;
      lightboxImg.alt = caption;
      lightboxTitle.textContent = caption;
      caseLightbox.classList.add('show');
      caseLightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (btnCloseLightbox) {
        setTimeout(() => btnCloseLightbox.focus(), 50);
      }
    };

    const closeLightbox = () => {
      caseLightbox.classList.remove('show');
      caseLightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 250);
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
        lastFocusedTrigger.focus();
      }
    };

    caseWrappers.forEach(wrap => {
      const triggerOpen = () => {
        const fullImg = wrap.getAttribute('data-full-img');
        const caption = wrap.getAttribute('data-caption') || 'Caso Clínico — Dra. Laís Torres';
        if (fullImg) openLightbox(fullImg, caption, wrap);
      };

      wrap.addEventListener('click', triggerOpen);
      wrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
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

    // Trap focus dentro do Lightbox ativo (WCAG 2.2 Modal Requirement)
    caseLightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && caseLightbox.classList.contains('show')) {
        const focusableElements = caseLightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) return;
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
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

  // =========================================================================
  // 17. Smart WhatsApp Concierge & Horários de Atendimento em Tempo Real
  // =========================================================================
  const initSmartWhatsAppWidget = () => {
    const conciergeCard = document.getElementById('whatsappConciergeCard');
    const floatingPill = document.getElementById('floatingStatusPill');
    const floatingPillBeacon = document.getElementById('floatingPillBeacon');
    const floatingPillText = document.getElementById('floatingPillText');
    const floatingBtn = document.getElementById('floatingWhatsappBtn');
    const floatingBtnIndicator = document.getElementById('floatingBtnIndicator');
    const conciergeAvatarDot = document.getElementById('conciergeAvatarDot');
    const conciergeStatusBeacon = document.getElementById('conciergeStatusBeacon');
    const conciergeStatusLabel = document.getElementById('conciergeStatusLabel');
    const conciergeChatMsg = document.getElementById('conciergeChatMsg');
    const conciergeChatTime = document.getElementById('conciergeChatTime');
    const conciergeScheduleDetail = document.getElementById('conciergeScheduleDetail');
    const btnConciergeAction = document.getElementById('btnConciergeAction');
    const conciergeActionText = document.getElementById('conciergeActionText');
    const btnCloseConcierge = document.getElementById('btnCloseConcierge');
    const container = document.getElementById('floatingWhatsapp');

    if (!floatingBtn) return;

    // Retorna a data e hora atual no fuso horário de São Paulo (Brasília - UTC-3)
    const getSaoPauloDate = () => {
      try {
        const now = new Date();
        const spString = now.toLocaleString("en-US", { timeZone: CLINIC_CONFIG.schedule.timezone });
        return new Date(spString);
      } catch (e) {
        return new Date();
      }
    };

    // Avalia o status exato da clínica
    const evaluateStatus = () => {
      const spDate = getSaoPauloDate();
      const day = spDate.getDay(); // 0: Dom, 1: Seg, ..., 6: Sáb
      const totalMinutes = spDate.getHours() * 60 + spDate.getMinutes();
      const sched = CLINIC_CONFIG.schedule;

      let isOpen = false;
      let pillText = "";
      let statusLabel = "";
      let scheduleDetail = "";
      let chatMsg = "";
      let actionText = "";
      let whatsappText = "";

      if (day >= 1 && day <= 5) {
        // Segunda a Sexta
        if (totalMinutes >= sched.weekdayOpen && totalMinutes < sched.weekdayClose) {
          isOpen = true;
          pillText = "Online agora • Resposta rápida";
          statusLabel = "Online agora (Atendimento até 18:30)";
          scheduleDetail = "Atendimento hoje: das 09h às 18h30";
          chatMsg = "Olá! 👋 Nossa equipe está disponível no WhatsApp agora. Como posso te ajudar com a sua avaliação em Santo André?";
          actionText = "Conversar no WhatsApp Agora";
          whatsappText = "Olá, Dra. Laís Torres! Estou no site e gostaria de agendar uma consulta de avaliação em Santo André.";
        } else if (totalMinutes < sched.weekdayOpen) {
          isOpen = false;
          pillText = "Fora do expediente • Deixe sua mensagem";
          statusLabel = "Fora do expediente (Abertura às 09:00)";
          scheduleDetail = "Abrimos hoje às 09:00";
          chatMsg = "Olá! 👋 Nossa clínica abre hoje às 09:00, mas você já pode enviar sua mensagem agora. Responderemos com prioridade na abertura!";
          actionText = "Deixar Mensagem no WhatsApp";
          whatsappText = "Olá, Dra. Laís! Deixo minha mensagem antes da abertura para retorno assim que o expediente iniciar.";
        } else {
          isOpen = false;
          pillText = "Fora do expediente • Deixe sua mensagem";
          if (day === 5) {
            statusLabel = "Fechado por hoje • Retornamos amanhã";
            scheduleDetail = "Retornamos amanhã (Sábado) às 09:00";
            chatMsg = "Olá! 👋 Nosso atendimento presencial de sexta encerrou. Retornamos amanhã às 09:00. Deixe sua mensagem agora mesmo!";
          } else {
            statusLabel = "Fechado por hoje • Retornamos amanhã";
            scheduleDetail = "Retornamos amanhã às 09:00";
            chatMsg = "Olá! 👋 Nosso atendimento encerrou por hoje. Retornamos amanhã às 09:00. Pode deixar sua mensagem que responderemos logo cedo!";
          }
          actionText = "Deixar Mensagem no WhatsApp";
          whatsappText = "Olá, Dra. Laís Torres! Vi que estão fora do horário de atendimento, mas deixo minha mensagem para retorno assim que abrirem.";
        }
      } else if (day === 6) {
        // Sábado
        if (totalMinutes >= sched.saturdayOpen && totalMinutes < sched.saturdayClose) {
          isOpen = true;
          pillText = "Online agora • Plantão de Sábado";
          statusLabel = "Online agora (Atendimento até 13:00)";
          scheduleDetail = "Atendimento hoje (Sábado): das 09h às 13h";
          chatMsg = "Olá! 👋 Estamos em atendimento hoje (Sábado) até às 13h. Gostaria de tirar dúvidas ou agendar sua avaliação?";
          actionText = "Falar no WhatsApp Agora";
          whatsappText = "Olá, Dra. Laís Torres! Gostaria de falar sobre agendamento neste sábado.";
        } else if (totalMinutes < sched.saturdayOpen) {
          isOpen = false;
          pillText = "Fora do expediente • Deixe sua mensagem";
          statusLabel = "Fora do expediente (Abertura às 09:00)";
          scheduleDetail = "Abrimos hoje (Sábado) às 09:00";
          chatMsg = "Olá! 👋 Abrimos hoje às 09:00. Deixe sua mensagem que nossa recepção responderá logo no início do plantão!";
          actionText = "Deixar Mensagem no WhatsApp";
          whatsappText = "Olá, Dra. Laís! Deixo minha mensagem para o plantão de sábado.";
        } else {
          isOpen = false;
          pillText = "Fechado agora • Deixe sua mensagem";
          statusLabel = "Fechado no fim de semana";
          scheduleDetail = "Retornamos segunda-feira às 09:00";
          chatMsg = "Olá! 👋 Nosso atendimento de sábado encerrou. Retornamos na segunda-feira às 09:00. Deixe sua mensagem e garantiremos sua prioridade na fila!";
          actionText = "Deixar Mensagem no WhatsApp";
          whatsappText = "Olá, Dra. Laís Torres! Deixo minha mensagem no final de semana para retorno na segunda-feira.";
        }
      } else {
        // Domingo
        isOpen = false;
        pillText = "Fechado aos domingos • Deixe recado";
        statusLabel = "Fechado aos domingos";
        scheduleDetail = "Retornamos amanhã (Segunda) às 09:00";
        chatMsg = "Olá! 👋 Aos domingos a clínica física está em pausa, mas nosso canal de WhatsApp recebe mensagens normalmente. Responderemos logo cedo na segunda-feira!";
        actionText = "Deixar Mensagem no WhatsApp";
        whatsappText = "Olá, Dra. Laís Torres! Gostaria de deixar meu pré-agendamento de domingo para retorno na segunda-feira.";
      }

      const timeFormatted = spDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const targetUrl = `https://wa.me/${CLINIC_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

      // Atualiza textos
      if (floatingPillText) floatingPillText.textContent = pillText;
      if (conciergeStatusLabel) conciergeStatusLabel.textContent = statusLabel;
      if (conciergeChatMsg) conciergeChatMsg.textContent = chatMsg;
      if (conciergeChatTime) conciergeChatTime.textContent = timeFormatted;
      if (conciergeScheduleDetail) conciergeScheduleDetail.textContent = scheduleDetail;
      if (conciergeActionText) conciergeActionText.textContent = actionText;

      // Atualiza links
      if (btnConciergeAction) btnConciergeAction.setAttribute('href', targetUrl);
      if (floatingBtn) floatingBtn.setAttribute('href', targetUrl);

      // Atualiza classes visuais (online vs offline)
      const stateClass = isOpen ? 'online' : 'offline';
      const removeClass = isOpen ? 'offline' : 'online';

      [floatingPillBeacon, floatingBtnIndicator, conciergeAvatarDot, conciergeStatusBeacon].forEach(el => {
        if (el) {
          el.classList.add(stateClass);
          el.classList.remove(removeClass);
        }
      });
    };

    // Executa avaliação inicial
    evaluateStatus();

    // Reavalia a cada 30 segundos para transição instantânea quando a clínica abrir/fechar
    setInterval(evaluateStatus, 30000);

    // Controles de Abertura / Fechamento do Card Concierge
    const openConcierge = () => {
      if (conciergeCard) {
        conciergeCard.classList.add('open');
        conciergeCard.setAttribute('aria-hidden', 'false');
      }
    };

    const closeConcierge = () => {
      if (conciergeCard) {
        conciergeCard.classList.remove('open');
        conciergeCard.setAttribute('aria-hidden', 'true');
      }
    };

    const toggleConcierge = (e) => {
      if (e) e.preventDefault();
      if (conciergeCard && conciergeCard.classList.contains('open')) {
        closeConcierge();
      } else {
        openConcierge();
      }
    };

    // Ao clicar na pílula de status, abre/fecha o concierge
    if (floatingPill) {
      floatingPill.addEventListener('click', toggleConcierge);
      floatingPill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleConcierge();
        }
      });
    }

    // Botão de fechar do card
    if (btnCloseConcierge) {
      btnCloseConcierge.addEventListener('click', (e) => {
        e.stopPropagation();
        closeConcierge();
        sessionStorage.setItem('concierge_dismissed', 'true');
      });
    }

    // Fechar ao clicar fora do container
    document.addEventListener('click', (e) => {
      if (container && !container.contains(e.target)) {
        closeConcierge();
      }
    });

    // Fechar com a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeConcierge();
    });

    // Auto-apresentação delicada (após 10 segundos na primeira visita da sessão)
    setTimeout(() => {
      if (!sessionStorage.getItem('concierge_dismissed') && conciergeCard && !conciergeCard.classList.contains('open')) {
        openConcierge();
        // Fecha automaticamente após 8 segundos se o usuário não interagir
        setTimeout(() => {
          if (!sessionStorage.getItem('concierge_interacted')) {
            closeConcierge();
          }
        }, 8000);
      }
    }, 10000);

    if (btnConciergeAction) {
      btnConciergeAction.addEventListener('click', () => {
        sessionStorage.setItem('concierge_interacted', 'true');
      });
    }
  };

  // Inicializa o Smart WhatsApp Widget
  initSmartWhatsAppWidget();

  // Log informativo para o desenvolvedor
  console.log("%c Dra. Laís Torres | Landing Page, Cookies & Smart Concierge Carregados ", "background: #C5A880; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
});
