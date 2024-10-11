import React from "react";

const MyFooter = () => (
  <footer style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} className='text-center text-lg-start text-muted'>
    <section className='border-bottom'>
      <div className='container text-center text-md-start mt-5'>
        &nbsp;
        <div className='row mt-3'>
          <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4 text-center'>
            <h6 className='text-uppercase fw-bold mb-4'>
              <i className='fas fa-gem me-3'></i>MELVIN FRANCO
            </h6>
            <p>
              Accede a los cursos de tecnología más novedosos y destacados del mercado.
            </p>
          </div>

          <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mb-4 text-center'>
            <h6 className='text-uppercase fw-bold mb-4'>Cursos</h6>
            <p>
              <a href='/' target="_blank" className='text-reset'>
                Solidity
              </a>
            </p>
            <p>
              <a href='/' target="_blank" className='text-reset'>
                DAPPS
              </a>
            </p>
            <p>
              <a href='/' target="_blank" className='text-reset'>
                AWS
              </a>
            </p>
            <p>
              <a href='/' target="_blank" className='text-reset'>
                Docker
              </a>
            </p>
            <p>
              <a href='/' target="_blank" className='text-reset'>
                CIBERSEGURIDAD
              </a>
            </p>
          </div>
          <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4 text-center'>
            <h6 className='text-uppercase fw-bold mb-4'>Contacto</h6>
            <p>
              <i className='fas fa-envelope me-3'></i>
              melvinfrancopedraza@proton.me
            </p>
          </div>
        </div>
      </div>
    </section>

    <div className='text-center p-4 bg-dark text-white' >
      © 2024 Copyright
    </div>
  </footer>
);

export default MyFooter;