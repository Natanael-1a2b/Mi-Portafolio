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
   
// para la vista de detalles
const proyectoModal = document.getElementById('proyectoModal');
const proyectoVideo = document.getElementById('proyectoVideo');
const proyectoVideoContainer = document.getElementById('proyectoVideoContainer');

proyectoModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;

    const title = button.getAttribute('data-title');
    const img = button.getAttribute('data-img');
    const desc = button.getAttribute('data-desc');
    const tecnologias = button.getAttribute('data-tecnologias').split(',');
    const link = button.getAttribute('data-link');
    const video = button.getAttribute('data-video');

    proyectoModal.querySelector('.modal-title').textContent = title;
    document.getElementById('proyectoImagen').src = img;
    document.getElementById('proyectoDescripcion').textContent = desc;

    const techContainer = document.getElementById('proyectoTecnologias');
    techContainer.innerHTML = '';
    tecnologias.forEach(tec => {
        const span = document.createElement('span');
        span.classList.add('badge');
        span.textContent = tec.trim();
        techContainer.appendChild(span);
    });

    document.getElementById('proyectoLink').href = link;

    // Mostrar video si existe
    if (video) {
        proyectoVideoContainer.style.display = 'block';
        proyectoVideo.src = `https://www.youtube.com/embed/${video}?autoplay=1&rel=0`;
    } else {
        proyectoVideoContainer.style.display = 'none';
        proyectoVideo.src = '';
    }
});

// Detener video al cerrar modal
proyectoModal.addEventListener('hidden.bs.modal', () => {
    proyectoVideo.src = '';
});

//evento para limpiar form al enviar 
const form = document.getElementById("formContacto");
const alertContainer = document.getElementById("alertContainer");

function showAlert(message, type, icon) {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert"><i class="bi bi-${icon}"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: form.method,
    body: formData,
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      form.reset();
      showAlert("Mensaje enviado correctamente", "success", "check-circle-fill");
    } else {
      showAlert("Error al enviar el mensaje", "danger", "exclamation-octagon");
    }
  }).catch(() => {
    showAlert("Error al enviar el mensaje", "danger", "exclamation-octagon");
  });
});


