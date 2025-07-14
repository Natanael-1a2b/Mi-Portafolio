// Efecto de desplazamiento --> barra de navegación
      window.addEventListener('scroll', function() {
         const navbar = document.querySelector('.navbar');
         if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
         } else {
            navbar.classList.remove('scrolled');
         }
      });

      // Desplazamiento suave para enlaces de anclaje
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
         anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
               window.scrollTo({
                  top: target.offsetTop - 70,
                  behavior: 'smooth'
               });
            }
         });
      });

      // Actualizar el enlace de navegación activo según la posición de desplazamiento
      window.addEventListener('scroll', function() {
         const sections = document.querySelectorAll('section');
         const navLinks = document.querySelectorAll('.nav-link');
         
         let current = '';
         
         sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 100)) {
               current = section.getAttribute('id');
            }
         });
         
         navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
               link.classList.add('active');
            }
         });
      });
   