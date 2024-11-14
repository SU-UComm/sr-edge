const Swiper = jest.fn().mockImplementation(() => ({
    init: jest.fn(),
    slideNext: jest.fn(),
    slidePrev: jest.fn(),
    destroy: jest.fn(),
}));
  
export default Swiper;